import {
  users,
  type User,
  type UpsertUser,
  workouts,
  type Workout,
  type InsertWorkout,
  type UpdateWorkout,
  workoutExercises,
  type WorkoutExercise,
  type InsertWorkoutExercise,
  exercises,
  type Exercise,
  userProfiles,
  type UserProfile,
  type UpsertUserProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workout operations
  getWorkouts(userId?: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: UpdateWorkout): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;
  getFavoriteWorkouts(userId: string): Promise<Workout[]>;
  getCompletedWorkouts(userId: string): Promise<Workout[]>;
  getNextWorkout(userId: string): Promise<Workout | undefined>;
  getPopularWorkouts(limit?: number): Promise<Workout[]>;
  
  // Workout Exercise operations
  getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]>;
  addExerciseToWorkout(exercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  updateWorkoutExercise(id: string, exercise: Partial<WorkoutExercise>): Promise<WorkoutExercise | undefined>;
  removeExerciseFromWorkout(id: string): Promise<boolean>;
  
  // Exercise operations
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: UpsertUserProfile): Promise<UserProfile>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Workout operations
  async getWorkouts(userId?: string): Promise<Workout[]> {
    if (userId) {
      return db
        .select()
        .from(workouts)
        .where(eq(workouts.userId, userId))
        .orderBy(desc(workouts.createdAt));
    }
    return db.select().from(workouts).orderBy(desc(workouts.createdAt));
  }
  
  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }
  
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }
  
  async updateWorkout(id: string, workout: UpdateWorkout): Promise<Workout | undefined> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        ...workout,
        updatedAt: new Date()
      })
      .where(eq(workouts.id, id))
      .returning();
    return updatedWorkout;
  }
  
  async deleteWorkout(id: string): Promise<boolean> {
    // First delete all related workout exercises
    await db.delete(workoutExercises).where(eq(workoutExercises.workoutId, id));
    
    // Then delete the workout
    const [deletedWorkout] = await db
      .delete(workouts)
      .where(eq(workouts.id, id))
      .returning({ id: workouts.id });
    
    return !!deletedWorkout;
  }
  
  async getFavoriteWorkouts(userId: string): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        eq(workouts.isFavorite, true)
      ))
      .orderBy(desc(workouts.updatedAt));
  }
  
  async getCompletedWorkouts(userId: string): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        eq(workouts.isCompleted, true)
      ))
      .orderBy(desc(workouts.completedAt));
  }
  
  async getNextWorkout(userId: string): Promise<Workout | undefined> {
    const [nextWorkout] = await db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        eq(workouts.isCompleted, false)
      ))
      .orderBy(desc(workouts.updatedAt))
      .limit(1);
    
    return nextWorkout;
  }
  
  async getPopularWorkouts(limit: number = 3): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .orderBy(desc(workouts.createdAt))
      .limit(limit);
  }
  
  // Workout Exercise operations
  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .orderBy(workoutExercises.order);
  }
  
  async addExerciseToWorkout(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const [newExercise] = await db
      .insert(workoutExercises)
      .values(exercise)
      .returning();
    
    return newExercise;
  }
  
  async updateWorkoutExercise(id: string, exercise: Partial<WorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const [updatedExercise] = await db
      .update(workoutExercises)
      .set(exercise)
      .where(eq(workoutExercises.id, id))
      .returning();
    
    return updatedExercise;
  }
  
  async removeExerciseFromWorkout(id: string): Promise<boolean> {
    const [deletedExercise] = await db
      .delete(workoutExercises)
      .where(eq(workoutExercises.id, id))
      .returning({ id: workoutExercises.id });
    
    return !!deletedExercise;
  }
  
  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return db.select().from(exercises);
  }
  
  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }
  
  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }
  
  async upsertUserProfile(profile: UpsertUserProfile): Promise<UserProfile> {
    const [upsertedProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          ...profile,
          updatedAt: new Date()
        }
      })
      .returning();
    
    return upsertedProfile;
  }
}

export const storage = new DatabaseStorage();
