"use client";

import type { ExerciseRecord, Session } from "@nina/nina-core";
import { Button, Card, CardContent } from "@nina/ui-components";
import { ChevronLeft, Edit2, Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
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
	const [currentWeight, setCurrentWeight] = useState<number>(0);
	const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
	const [currentDistance, setCurrentDistance] = useState<number>(0);
	const [isSaving, setIsSaving] = useState(false);
	const router = useRouter();

	const currentExerciseDef = EXERCISES.find((e) => e.id === selectedExerciseId);

	const handleExerciseSelect = (exerciseId: string) => {
		const exerciseDef = EXERCISES.find((e) => e.id === exerciseId);
		setSelectedExerciseId(exerciseId);
		setCurrentValue(0);
		setCurrentWeight(exerciseDef?.defaultWeight || 0);
		setCurrentMultiplier(1);
		setCurrentDistance(0);
		setView("record-exercise");
	};

	const handleEditRecord = (record: ExerciseRecord) => {
		setSelectedExerciseId(record.exerciseId);
		setCurrentValue(record.value);
		setCurrentWeight(record.weight || 0);
		setCurrentMultiplier(record.multiplier || 1);
		setCurrentDistance(record.distance || 0);
		setEditingRecordId(record.id);
		setView("record-exercise");
	};

	const handleDeleteRecord = async (recordId: string) => {
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
			weight:
				currentExerciseDef.inputType === "reps-weight"
					? currentWeight
					: undefined,
			multiplier: currentMultiplier > 1 ? currentMultiplier : undefined,
			distance:
				currentExerciseDef.inputType === "time-distance"
					? currentDistance
					: undefined,
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
										<Image
											src={exercise.image}
											alt={exercise.label}
											className="object-contain"
											fill
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
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center">
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

					{editingRecordId && (
						<Button
							variant="ghost"
							size="icon"
							className="text-destructive hover:bg-destructive/10"
							onClick={() =>
								handleDeleteRecord(editingRecordId).then(() => {
									setView("summary");
									setEditingRecordId(null);
								})
							}
						>
							<Trash2 className="h-5 w-5" />
						</Button>
					)}
				</div>

				<div className="flex flex-col items-center space-y-8">
					{(currentExerciseDef.inputType === "reps" ||
						currentExerciseDef.inputType === "reps-weight") && (
						<div className="w-full space-y-6">
							<div className="flex justify-center items-center gap-4">
								<div className="text-center">
									<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
										Sets
									</div>
									<div className="text-6xl font-bold text-green-600 dark:text-green-400">
										{currentMultiplier}
									</div>
								</div>
								<div className="text-2xl text-muted-foreground font-light pt-4">
									x
								</div>
								<div className="text-center">
									<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
										Reps
									</div>
									<div className="text-6xl font-bold">{currentValue}</div>
								</div>
								{currentExerciseDef.inputType === "reps-weight" && (
									<>
										<div className="text-2xl text-muted-foreground font-light pt-4">
											@
										</div>
										<div className="text-center">
											<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
												Weight
											</div>
											<div className="text-6xl font-bold text-blue-500">
												{currentWeight}
											</div>
										</div>
									</>
								)}
							</div>

							<div className="flex justify-center gap-4 border-b pb-6">
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										setCurrentMultiplier((p) => Math.max(1, p - 1))
									}
								>
									<MinusIcon />
								</Button>
								<div className="flex items-center font-bold w-20 justify-center">
									Sets
								</div>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCurrentMultiplier((p) => p + 1)}
								>
									<PlusIcon />
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-4">
								{currentExerciseDef.defaultValues?.map((val) => (
									<Button
										key={val}
										variant="outline"
										size="lg"
										onClick={() => setCurrentValue(val)}
									>
										{val} Reps
									</Button>
								))}
							</div>

							<div className="flex justify-center gap-4">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCurrentValue((p) => Math.max(0, p - 1))}
								>
									<MinusIcon />
								</Button>
								<div className="flex items-center font-bold w-20 justify-center">
									Reps
								</div>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCurrentValue((p) => p + 1)}
								>
									<PlusIcon />
								</Button>
							</div>

							{currentExerciseDef.inputType === "reps-weight" && (
								<div className="flex justify-center gap-4 border-t pt-4">
									<Button
										variant="outline"
										size="icon"
										onClick={() => setCurrentWeight((p) => Math.max(0, p - 5))}
									>
										<MinusIcon />
									</Button>
									<div className="flex items-center font-bold w-20 justify-center">
										Weight
									</div>
									<Button
										variant="outline"
										size="icon"
										onClick={() => setCurrentWeight((p) => p + 5)}
									>
										<PlusIcon />
									</Button>
								</div>
							)}
						</div>
					)}

					{(currentExerciseDef.inputType === "time" ||
						currentExerciseDef.inputType === "time-distance") && (
						<div className="w-full space-y-6">
							{currentExerciseDef.inputType === "time-distance" ? (
								<div className="w-full space-y-6">
									{/* Distance Input */}
									<div className="text-center">
										<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
											Distance (km)
										</div>
										{/* Manual Input roughly styled as display */}
										<input
											type="number"
											step="0.01"
											className="text-6xl font-bold bg-transparent text-center w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
											value={currentDistance === 0 ? "" : currentDistance}
											onChange={(e) =>
												setCurrentDistance(parseFloat(e.target.value) || 0)
											}
											placeholder="0.00"
										/>
									</div>
									<div className="grid grid-cols-3 gap-2">
										{currentExerciseDef.defaultDistances?.map((val) => (
											<Button
												key={val}
												variant="outline"
												onClick={() => setCurrentDistance(val)}
												className={
													currentDistance === val ? "border-primary" : ""
												}
											>
												{val} km
											</Button>
										))}
									</div>

									{/* Time Component */}
									<div className="pt-4 border-t space-y-4">
										<div className="text-center">
											<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
												Minutes
											</div>
											<div className="text-6xl font-bold">{currentValue}</div>
										</div>

										{/* Presets for Time */}
										<div className="grid grid-cols-2 gap-4">
											{currentExerciseDef.defaultValues?.map((val) => (
												<Button
													key={val}
													variant="outline"
													size="lg"
													onClick={() => setCurrentValue(val)}
												>
													{val} Min
												</Button>
											))}
										</div>

										{/* Manual Controls for Time */}
										<div className="flex justify-center gap-4">
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													setCurrentValue((p) => Math.max(0, p - 1))
												}
											>
												<MinusIcon />
											</Button>
											<div className="flex items-center font-bold w-20 justify-center">
												Min
											</div>
											<Button
												variant="outline"
												size="icon"
												onClick={() => setCurrentValue((p) => p + 1)}
											>
												<PlusIcon />
											</Button>
										</div>
									</div>
								</div>
							) : currentExerciseDef.timeUnit === "minutes" ? (
								<div className="w-full space-y-6">
									<div className="text-center">
										<div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
											Minutes
										</div>
										<div className="text-6xl font-bold">{currentValue}</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										{currentExerciseDef.defaultValues?.map((val) => (
											<Button
												key={val}
												variant="outline"
												size="lg"
												onClick={() => setCurrentValue(val)}
											>
												{val} Min
											</Button>
										))}
									</div>
									<div className="flex justify-center gap-4">
										<Button
											variant="outline"
											size="icon"
											onClick={() => setCurrentValue((p) => Math.max(0, p - 1))}
										>
											<MinusIcon />
										</Button>
										<div className="flex items-center font-bold w-20 justify-center">
											Min
										</div>
										<Button
											variant="outline"
											size="icon"
											onClick={() => setCurrentValue((p) => p + 1)}
										>
											<PlusIcon />
										</Button>
									</div>
								</div>
							) : (
								<div className="w-full space-y-6">
									<div className="flex justify-center gap-4 border-b pb-6">
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												setCurrentMultiplier((p) => Math.max(1, p - 1))
											}
										>
											<MinusIcon />
										</Button>
										<div className="flex items-center font-bold w-20 justify-center">
											{currentMultiplier} Sets
										</div>
										<Button
											variant="outline"
											size="icon"
											onClick={() => setCurrentMultiplier((p) => p + 1)}
										>
											<PlusIcon />
										</Button>
									</div>

									{currentExerciseDef.defaultValues && (
										<div className="grid grid-cols-4 gap-2">
											{currentExerciseDef.defaultValues.map((val) => (
												<Button
													key={val}
													variant="outline"
													size="sm"
													onClick={() => setCurrentValue(val)}
												>
													{val}s
												</Button>
											))}
										</div>
									)}

									<Timer
										initialSeconds={currentValue}
										onTimeChange={setCurrentValue}
									/>
								</div>
							)}
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

					{/* The delete button below was removed as per instructions */}
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

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-24">
				{session.exercises.length === 0 && (
					<div className="col-span-full text-muted-foreground w-full text-center py-8 border rounded-lg border-dashed">
						No exercises recorded yet.
					</div>
				)}
				{session.exercises
					.slice()
					.reverse()
					.map((record) => {
						// Most recent first
						const def = EXERCISES.find((e) => e.id === record.exerciseId);
						const isWeight = record.type === "reps-weight";

						return (
							<Card
								key={record.id}
								className="relative overflow-hidden group cursor-pointer hover:bg-accent/50 transition-colors"
								onClick={() => handleEditRecord(record)}
							>
								<CardContent className="p-3 flex flex-col justify-between h-full min-h-[140px]">
									<div className="w-full relative">
										<div className="font-semibold text-sm leading-tight line-clamp-2 pr-6">
											{def?.label || record.exerciseId}
										</div>
									</div>

									<div className="flex flex-col items-center justify-center flex-1 my-2">
										<div className="text-3xl font-bold tracking-tight text-center">
											{record.type === "time" ? (
												def?.timeUnit === "minutes" ? (
													`${record.value}m`
												) : (
													formatDuration(record.value)
												)
											) : record.type === "time-distance" ? (
												<div className="flex flex-col items-center">
													<span>{record.distance} km</span>
													<span className="text-lg font-normal text-muted-foreground">
														{def?.timeUnit === "minutes"
															? `${record.value}m`
															: formatDuration(record.value)}
													</span>
												</div>
											) : (
												<div className="flex items-baseline gap-1">
													{record.multiplier && record.multiplier > 1 && (
														<span className="text-xl text-muted-foreground">
															{record.multiplier}x
														</span>
													)}
													<span>{record.value}</span>
												</div>
											)}
										</div>
										<div className="text-xs text-muted-foreground uppercase font-medium">
											{record.type === "time"
												? def?.timeUnit === "minutes"
													? "Minutes"
													: "Duration"
												: record.type === "time-distance"
													? "Distance & Time"
													: "Reps"}
										</div>

										{isWeight && record.weight !== undefined && (
											<div className="mt-2 flex flex-col items-center">
												<div className="text-xl font-bold text-blue-600 dark:text-blue-400">
													{record.weight}
												</div>
												<div className="text-[10px] text-muted-foreground uppercase font-medium">
													kg
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						);
					})}
			</div>

			<div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-10 pointer-events-none">
				<Button
					size="lg"
					className="shadow-xl w-full max-w-md pointer-events-auto"
					onClick={() => setView("select-exercise")}
				>
					<Plus className="mr-2 h-6 w-6" /> Add Exercise
				</Button>
			</div>
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
