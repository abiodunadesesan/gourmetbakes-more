import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Instruction {
    instruction_id: string;
    step_number: number;
    description: string;
    image_url?: string;
    video_url?: string;
    tip?: string;
}

interface InstructionsListProps {
    instructions: Instruction[];
}

export default function InstructionsList({ instructions }: InstructionsListProps) {
    // Sort just in case it didn't come sorted
    const sorted = [...instructions].sort((a, b) => a.step_number - b.step_number);

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-800">Instructions</h3>
            
            <div className="space-y-10">
                {sorted.map((inst, index) => (
                    <div key={inst.instruction_id} className="relative pl-12 sm:pl-16">
                        {/* Step Number Circle */}
                        <div className="absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-slate-100 shrink-0">
                            {inst.step_number}
                        </div>
                        
                        {/* Connecting Line */}
                        {index !== sorted.length - 1 && (
                            <div className="absolute left-4 sm:left-5 top-10 sm:top-12 bottom-0 w-0.5 bg-slate-100 -ml-px h-full" />
                        )}

                        <div className="pt-1 sm:pt-2">
                            <p className="text-slate-700 leading-relaxed text-lg mb-4">
                                {inst.description}
                            </p>

                            {inst.image_url && (
                                <img 
                                    src={inst.image_url} 
                                    alt={`Step ${inst.step_number}`} 
                                    className="rounded-2xl w-full max-w-2xl object-cover h-64 mb-4 border border-slate-100 shadow-sm"
                                />
                            )}

                            {inst.tip && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 shadow-sm inline-block max-w-2xl w-full">
                                    <Lightbulb className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-amber-900 mb-1 leading-none">Chef's Tip</div>
                                        <p className="text-sm leading-relaxed">{inst.tip}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
