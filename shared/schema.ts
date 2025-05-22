import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Workout table
export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration").default(30),
  level: varchar("level").default("iniciante"),
  imageUrl: text("image_url"),
  progress: integer("progress").default(0),
  isFavorite: boolean("is_favorite").default(false),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const updateWorkoutSchema = insertWorkoutSchema.partial();

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type UpdateWorkout = z.infer<typeof updateWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

// Exercise table
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  muscleGroup: varchar("muscle_group").notNull(),
  equipment: varchar("equipment").notNull(),
  difficulty: varchar("difficulty").default("intermediate"),
  imageUrl: text("image_url").notNull(),
  instructions: jsonb("instructions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;

// Workout Exercise table (join table)
export const workoutExercises = pgTable("workout_exercises", {
  id: varchar("id").primaryKey().notNull(),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id),
  exerciseId: varchar("exercise_id").notNull(),
  name: varchar("name").notNull(),
  sets: integer("sets").default(3),
  reps: integer("reps").default(12),
  restTime: integer("rest_time").default(60),
  notes: text("notes"),
  order: integer("order").default(0),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;

// User Profile table
export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().notNull().references(() => users.id),
  height: integer("height"),
  weight: integer("weight"),
  goal: varchar("goal"),
  trainingDays: jsonb("training_days").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserProfileSchema = createInsertSchema(userProfiles).omit({
  createdAt: true,
  updatedAt: true,
});

export type UpsertUserProfile = z.infer<typeof upsertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
