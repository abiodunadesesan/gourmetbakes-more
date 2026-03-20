'use client';

import { Check, ChefHat, Truck, Package, Clock } from 'lucide-react';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface StatusStage {
    id: OrderStatus;
    label: string;
    icon: React.ElementType;
}

const STAGES: StatusStage[] = [
    { id: 'pending', label: 'Order Received', icon: Clock },
    { id: 'confirmed', label: 'Confirmed', icon: Check },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'on_the_way', label: 'On the Way', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Package },
];

interface StatusTimelineProps {
    currentStatus: OrderStatus;
    history: any[]; // OrderStatusHistory[]
}

export default function StatusTimeline({ currentStatus, history }: StatusTimelineProps) {
    const currentStageIndex = STAGES.findIndex(s => s.id === currentStatus);
    
    // Helper to get timestamp for a stage from history
    const getStageTime = (status: string) => {
        const item = history?.find(h => h.status === status);
        return item ? formatDate(item.timestamp) : null;
    };

    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10">
            <h3 className="text-xl font-bold text-slate-900 mb-10 font-serif">Delivery Timeline</h3>
            
            {/* Desktop: Vertical Timeline */}
            <div className="hidden lg:block relative pl-12 space-y-12">
                {/* Connecting Line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="w-full bg-orange-500 transition-all duration-1000 ease-in-out"
                        style={{ height: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                    />
                </div>

                {STAGES.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isActive = index === currentStageIndex;
                    const isFuture = index > currentStageIndex;
                    const timestamp = getStageTime(stage.id);
                    const Icon = stage.icon;

                    return (
                        <div key={stage.id} className="relative flex items-start gap-8">
                            {/* Circle icon */}
                            <div className={cn(
                                "absolute -left-12 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 z-10",
                                isCompleted ? "bg-slate-900 text-white" : "",
                                isActive ? "bg-orange-500 text-white ring-8 ring-orange-50" : "",
                                isFuture ? "bg-slate-50 text-slate-200" : ""
                            )}>
                                <Icon size={20} />
                            </div>

                            <div className="flex-grow pt-1.5 px-4">
                                <p className={cn(
                                    "font-black text-lg transition-colors",
                                    isActive ? "text-orange-500" : "text-slate-900",
                                    isFuture ? "text-slate-300" : ""
                                )}>
                                    {isActive && <span className="text-xs uppercase tracking-widest bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md mr-3 mb-1 inline-block align-middle">Current</span>}
                                    {stage.label}
                                </p>
                                {timestamp && (
                                    <p className="text-sm font-bold text-slate-400 mt-1">{timestamp}</p>
                                )}
                                {isActive && (
                                    <p className="text-sm text-slate-500 mt-2 font-medium">
                                        {stage.id === 'preparing' && 'Our chefs are working their magic...'}
                                        {stage.id === 'on_the_way' && 'The driver is heading to your location!'}
                                        {stage.id === 'confirmed' && 'We have started processing your order.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile: Horizontal Scrollable Timeline */}
            <div className="lg:hidden">
                <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-2 px-2 snap-x">
                    {STAGES.map((stage, index) => {
                        const isCompleted = index < currentStageIndex;
                        const isActive = index === currentStageIndex;
                        const isFuture = index > currentStageIndex;
                        const timestamp = getStageTime(stage.id);
                        const Icon = stage.icon;

                        return (
                            <div 
                                key={stage.id} 
                                className={cn(
                                    "flex-shrink-0 w-48 p-5 rounded-3xl border-2 snap-center transition-all",
                                    isActive ? "bg-orange-50 border-orange-200 outline outline-4 outline-orange-50" : "bg-white border-slate-50",
                                    isFuture ? "opacity-40" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all",
                                    isCompleted ? "bg-slate-900 text-white" : "bg-orange-500 text-white",
                                    isFuture ? "bg-slate-100 text-slate-400" : ""
                                )}>
                                    <Icon size={24} />
                                </div>
                                <p className={cn(
                                    "font-black text-sm uppercase tracking-tight",
                                    isActive ? "text-orange-600" : "text-slate-900"
                                )}>
                                    {stage.label}
                                </p>
                                {timestamp ? (
                                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{timestamp}</p>
                                ) : (
                                    <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">
                                        {isFuture ? 'Next Stage' : '...'}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl mt-6 flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <Clock size={16} />
                    </div>
                    <p className="text-xs font-bold text-orange-900 leading-relaxed">
                        Scroll left/right to see all status stages.
                    </p>
                </div>
            </div>
        </div>
    );
}
