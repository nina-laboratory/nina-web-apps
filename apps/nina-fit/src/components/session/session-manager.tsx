"use client";

import type { ExerciseRecord, Session } from "@nina/nina-core";
import { Button, Card, CardContent } from "@nina/ui-components";
import { ChevronLeft, Edit2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveMySession } from "../../app/actions";
import { EXERCISES } from "../../config/exercises";
import { Timer } from "../timer";

interface SessionManagerProps {
  initialSession: Session;
}

type ViewState = "summary" | "select-exercise" | "record-exercise";

export function SessionManager({ initialSession }: SessionManagerProps) {
  const [session, setSession] = useState<Session>(initialSession);
  const [view, setView] = useState<ViewState>("summary");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const currentExerciseDef = EXERCISES.find((e) => e.id === selectedExerciseId);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setCurrentValue(0);
    setView("record-exercise");
  };

  const handleEditRecord = (record: ExerciseRecord) => {
    setSelectedExerciseId(record.exerciseId);
    setCurrentValue(record.value);
    setEditingRecordId(record.id);
    setView("record-exercise");
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Delete this record?")) return;
    const updatedExercises = session.exercises.filter((e) => e.id !== recordId);
    await saveSession(updatedExercises);
  };

  const saveRecord = async () => {
    if (!selectedExerciseId || !currentExerciseDef) return;

    const newRecord: ExerciseRecord = {
      id: editingRecordId || crypto.randomUUID(),
      exerciseId: selectedExerciseId,
      type: currentExerciseDef.inputType,
      value: currentValue,
      timestamp: new Date().toISOString(),
    };

    let updatedExercises: ExerciseRecord[];
    if (editingRecordId) {
      updatedExercises = session.exercises.map((e) =>
        e.id === editingRecordId ? newRecord : e,
      );
    } else {
      updatedExercises = [...session.exercises, newRecord];
    }

    await saveSession(updatedExercises);
    setView("summary");
    setEditingRecordId(null);
    setSelectedExerciseId(null);
  };

  const saveSession = async (exercises: ExerciseRecord[]) => {
    setIsSaving(true);
    const updatedSession = { ...session, exercises };
    setSession(updatedSession);
    try {
      await saveMySession(updatedSession);
      router.refresh();
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save session");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Views ---

  if (view === "select-exercise") {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("summary")}
          >
            <ChevronLeft />
          </Button>
          <h2 className="text-xl font-bold ml-2">Select Exercise</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {EXERCISES.map((exercise) => (
            <Card
              key={exercise.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleExerciseSelect(exercise.id)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40 space-y-2">
                {exercise.image && (
                   <div className="relative w-16 h-16 opacity-80">
                      {/* Using standard img for now to simplify usage if Next.js Image needs config, 
                          but typically just <img /> works fine for local assets in public folder.
                          Actually, using Next Image is better. */}
                      <img 
                        src={exercise.image} 
                        alt={exercise.label} 
                        className="w-full h-full object-contain" 
                      />
                   </div>
                )}
                <span className="font-semibold text-sm">{exercise.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (view === "record-exercise" && currentExerciseDef) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setView("summary");
              setEditingRecordId(null);
            }}
          >
            <ChevronLeft />
          </Button>
          <h2 className="text-xl font-bold ml-2">
            {editingRecordId ? "Edit" : "Record"} {currentExerciseDef.label}
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {currentExerciseDef.inputType === "reps" && (
            <div className="w-full space-y-6">
              <div className="text-6xl font-bold text-center">
                {currentValue}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentExerciseDef.defaultValues?.map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentValue(val)}
                  >
                    {val}
                  </Button>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentValue((prev) => Math.max(0, prev - 1))
                  }
                >
                  <MinusIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentValue((prev) => prev + 1)}
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          )}

          {currentExerciseDef.inputType === "time" && (
            <div className="w-full">
              <Timer
                initialSeconds={currentValue}
                onTimeChange={setCurrentValue}
              />
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={saveRecord}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" /> Save Record
          </Button>
        </div>
      </div>
    );
  }

  // Summary View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Today's Progress</h2>
        <span className="text-sm text-muted-foreground">
          {session.exercises.length} Exercises
        </span>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {session.exercises.length === 0 && (
          <div className="text-muted-foreground w-full text-center py-8 border rounded-lg border-dashed">
            No exercises recorded yet.
          </div>
        )}
        {session.exercises
          .slice()
          .reverse()
          .map((record) => {
            // Most recent first
            const def = EXERCISES.find((e) => e.id === record.exerciseId);
            return (
              <Card key={record.id} className="min-w-[160px] snap-center">
                <CardContent className="p-4 space-y-4">
                  <div className="font-semibold">
                    {def?.label || record.exerciseId}
                  </div>
                  <div className="text-4xl font-bold">
                    {record.type === "time"
                      ? formatDuration(record.value)
                      : `${record.value}`}
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => handleEditRecord(record)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => setView("select-exercise")}
      >
        <Plus className="mr-2 h-6 w-6" /> Add Exercise
      </Button>
    </div>
  );
}

function PlusIcon() {
  return <Plus className="h-4 w-4" />;
}
function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <title>Decrease Value</title>
      <path d="M5 12h14" />
    </svg>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
