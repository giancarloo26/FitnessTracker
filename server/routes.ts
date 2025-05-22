import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertWorkoutSchema, insertWorkoutExerciseSchema, upsertUserProfileSchema } from "@shared/schema";
import { exerciseData } from "@shared/exercises";
import { v4 as uuidv4 } from "uuid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // WORKOUTS ENDPOINTS
  
  // Get all workouts for logged in user
  app.get('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });
  
  // Get a specific workout
  app.get('/api/workouts/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const workout = await storage.getWorkout(id);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });
  
  // Create a new workout
  app.post('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        userId,
        id: uuidv4()
      });
      
      const workout = await storage.createWorkout(workoutData);
      
      // If workout has exercises, add them
      if (req.body.exercises && Array.isArray(req.body.exercises)) {
        for (const [index, exercise] of req.body.exercises.entries()) {
          const exerciseData = insertWorkoutExerciseSchema.parse({
            ...exercise,
            id: exercise.id.startsWith('temp-') ? uuidv4() : exercise.id,
            workoutId: workout.id,
            order: index
          });
          
          await storage.addExerciseToWorkout(exerciseData);
        }
      }
      
      res.status(201).json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workout" });
    }
  });
  
  // Update a workout
  app.patch('/api/workouts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if workout exists and belongs to the user
      const existingWorkout = await storage.getWorkout(id);
      if (!existingWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      if (existingWorkout.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this workout" });
      }
      
      // Update workout
      const workoutData = {
        ...req.body,
        userId
      };
      
      const updatedWorkout = await storage.updateWorkout(id, workoutData);
      
      // Update workout exercises if provided
      if (req.body.exercises && Array.isArray(req.body.exercises)) {
        // First, remove all existing exercises for this workout
        const existingExercises = await storage.getWorkoutExercises(id);
        for (const exercise of existingExercises) {
          await storage.removeExerciseFromWorkout(exercise.id);
        }
        
        // Then add the new exercises
        for (const [index, exercise] of req.body.exercises.entries()) {
          const exerciseData = insertWorkoutExerciseSchema.parse({
            ...exercise,
            id: exercise.id.startsWith('temp-') ? uuidv4() : exercise.id,
            workoutId: id,
            order: index
          });
          
          await storage.addExerciseToWorkout(exerciseData);
        }
      }
      
      res.json(updatedWorkout);
    } catch (error) {
      console.error("Error updating workout:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update workout" });
    }
  });
  
  // Delete a workout
  app.delete('/api/workouts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if workout exists and belongs to the user
      const existingWorkout = await storage.getWorkout(id);
      if (!existingWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      if (existingWorkout.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to delete this workout" });
      }
      
      const deleted = await storage.deleteWorkout(id);
      
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete workout" });
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });
  
  // Get workout exercises
  app.get('/api/workouts/:id/exercises', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const exercises = await storage.getWorkoutExercises(id);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching workout exercises:", error);
      res.status(500).json({ message: "Failed to fetch workout exercises" });
    }
  });
  
  // Get favorite workouts
  app.get('/api/workouts/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getFavoriteWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching favorite workouts:", error);
      res.status(500).json({ message: "Failed to fetch favorite workouts" });
    }
  });
  
  // Get completed workouts
  app.get('/api/workouts/completed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getCompletedWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching completed workouts:", error);
      res.status(500).json({ message: "Failed to fetch completed workouts" });
    }
  });
  
  // Get next workout
  app.get('/api/workouts/next', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workout = await storage.getNextWorkout(userId);
      res.json(workout || null);
    } catch (error) {
      console.error("Error fetching next workout:", error);
      res.status(500).json({ message: "Failed to fetch next workout" });
    }
  });
  
  // Get popular workouts
  app.get('/api/workouts/popular', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const workouts = await storage.getPopularWorkouts(limit);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching popular workouts:", error);
      res.status(500).json({ message: "Failed to fetch popular workouts" });
    }
  });
  
  // EXERCISES ENDPOINTS
  
  // Get all exercises
  app.get('/api/exercises', isAuthenticated, async (req, res) => {
    try {
      // Get exercises from storage
      let exercises = await storage.getExercises();
      
      // If no exercises in storage, return mock data
      if (!exercises || exercises.length === 0) {
        exercises = exerciseData;
      }
      
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });
  
  // Get a specific exercise
  app.get('/api/exercises/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check storage first
      const exercise = await storage.getExercise(id);
      
      if (exercise) {
        return res.json(exercise);
      }
      
      // If not in storage, check mock data
      const mockExercise = exerciseData.find(ex => ex.id === id);
      
      if (mockExercise) {
        return res.json(mockExercise);
      }
      
      res.status(404).json({ message: "Exercise not found" });
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });
  
  // USER PROFILE ENDPOINTS
  
  // Get user profile
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile || {});
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  // Update user profile
  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const profileData = upsertUserProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.upsertUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
