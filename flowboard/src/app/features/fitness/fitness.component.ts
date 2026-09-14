import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ExerciseLog {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  isPR: boolean;
  completed: boolean;
}

export interface WorkoutRoutine {
  dayName: string;
  title: string;
  targetFocus: string;
  duration: string;
  exercises: ExerciseLog[];
}

@Component({
  selector: 'app-fitness',
  imports: [CommonModule, FormsModule],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.scss'
})
export class FitnessComponent {
  // Macros
  readonly caloriesConsumed = signal(2150);
  readonly caloriesTarget = signal(2400);
  readonly proteinConsumed = signal(175);
  readonly proteinTarget = signal(180);
  readonly carbsConsumed = signal(210);
  readonly carbsTarget = signal(250);
  readonly fatConsumed = signal(62);
  readonly fatTarget = signal(70);

  // Active workout day
  selectedDay = signal<string>('Thursday');

  // Modal
  isModalOpen = false;
  newExerciseName = '';
  newExerciseSets = 4;
  newExerciseReps = '8-10';
  newExerciseWeight = '80 kg';

  routines = signal<WorkoutRoutine[]>([
    {
      dayName: 'Monday',
      title: 'Push Day: Chest & Shoulders',
      targetFocus: 'Hypertrophy & Strength',
      duration: '65m',
      exercises: [
        { id: '1', name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10', weight: '85 kg', isPR: true, completed: true },
        { id: '2', name: 'Dumbbell Shoulder Overhead Press', sets: 3, reps: '10-12', weight: '28 kg', isPR: false, completed: true },
        { id: '3', name: 'Cable Chest Flys', sets: 3, reps: '12-15', weight: '18 kg', isPR: false, completed: true },
        { id: '4', name: 'Tricep Rope Pushdowns', sets: 4, reps: '12', weight: '32 kg', isPR: false, completed: true }
      ]
    },
    {
      dayName: 'Tuesday',
      title: 'Pull Day: Back & Biceps',
      targetFocus: 'Width & Thickness',
      duration: '70m',
      exercises: [
        { id: '5', name: 'Weighted Pull-Ups', sets: 4, reps: '6-8', weight: '+15 kg', isPR: true, completed: true },
        { id: '6', name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', weight: '90 kg', isPR: false, completed: true },
        { id: '7', name: 'Lat Pulldown (Neutral Grip)', sets: 3, reps: '10-12', weight: '70 kg', isPR: false, completed: true },
        { id: '8', name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '12', weight: '16 kg', isPR: false, completed: true }
      ]
    },
    {
      dayName: 'Thursday',
      title: 'Leg Day & Core Stability',
      targetFocus: 'Quad & Hamstring Power',
      duration: '75m',
      exercises: [
        { id: '9', name: 'Barbell Back Squats', sets: 4, reps: '6-8', weight: '125 kg', isPR: true, completed: false },
        { id: '10', name: 'Romanian Deadlifts (RDL)', sets: 4, reps: '8-10', weight: '110 kg', isPR: false, completed: false },
        { id: '11', name: 'Bulgarian Split Squats', sets: 3, reps: '10 / leg', weight: '22 kg', isPR: false, completed: false },
        { id: '12', name: 'Hanging Leg Raises', sets: 4, reps: '15', weight: 'Bodyweight', isPR: false, completed: false }
      ]
    },
    {
      dayName: 'Saturday',
      title: 'Zone 2 Cardio & Mobility',
      targetFocus: 'Aerobic Base & Recovery',
      duration: '50m',
      exercises: [
        { id: '13', name: 'Outdoor 6km Easy Pace Run', sets: 1, reps: '6 km', weight: 'Heart Rate ~140', isPR: false, completed: false },
        { id: '14', name: 'Full Body Mobility & Foam Rolling', sets: 1, reps: '20 mins', weight: 'Stretching', isPR: false, completed: false }
      ]
    }
  ]);

  get currentRoutine(): WorkoutRoutine | undefined {
    return this.routines().find(r => r.dayName === this.selectedDay());
  }

  toggleExercise(ex: ExerciseLog): void {
    ex.completed = !ex.completed;
  }

  openAddExerciseModal(): void {
    this.newExerciseName = '';
    this.newExerciseSets = 3;
    this.newExerciseReps = '10-12';
    this.newExerciseWeight = '50 kg';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveExercise(): void {
    if (!this.newExerciseName.trim()) return;

    const routine = this.currentRoutine;
    if (routine) {
      routine.exercises.push({
        id: Date.now().toString(),
        name: this.newExerciseName.trim(),
        sets: this.newExerciseSets,
        reps: this.newExerciseReps,
        weight: this.newExerciseWeight,
        isPR: false,
        completed: false
      });
    }

    this.closeModal();
  }
}
