"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { ReactNodeViewProps } from "@tiptap/react";

interface TimelineStep {
  title: string;
  description: string;
}

export function GrowthTimelineComponent(props: any) {
  const { node, updateAttributes } = props;
  const steps = (node.attrs?.steps ?? []) as TimelineStep[];
  const [isEditing, setIsEditing] = useState(false);
  const [editSteps, setEditSteps] = useState<TimelineStep[]>(steps || []);

  const addStep = () => {
    setEditSteps([...editSteps, { title: "New Step", description: "" }]);
  };

  const removeStep = (index: number) => {
    setEditSteps(editSteps.filter((_, i) => i !== index));
  };

  const updateStep = (
    index: number,
    field: keyof TimelineStep,
    value: string
  ) => {
    const updated = [...editSteps];
    updated[index] = { ...updated[index], [field]: value };
    setEditSteps(updated);
  };

  const handleSave = () => {
    updateAttributes({ steps: editSteps });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 rounded-2xl bg-white border-2 border-secondary-200 p-8 shadow-organic"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-700">Growth Timeline</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <Edit2 size={14} />
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="relative space-y-6">
        {/* Timeline Line */}
        <div className="absolute left-8 top-12 bottom-0 w-1 bg-gradient-to-b from-secondary-400 to-secondary-200 opacity-30">
          <div className="h-full border-l-2 border-dashed border-secondary-400" />
        </div>

        {/* Steps */}
        <div className="space-y-6 pl-24">
          {(isEditing ? editSteps : steps).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number Circle */}
              <div className="absolute -left-20 top-0 flex h-16 w-16 items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-400 text-white font-bold text-lg shadow-md"
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Content Card */}
              {isEditing ? (
                <motion.div
                  className="rounded-lg border-2 border-primary-200 bg-primary-50 p-4 space-y-2"
                  whileHover={{ boxShadow: "0 4px 12px rgba(45, 90, 39, 0.1)" }}
                >
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateStep(index, "title", e.target.value)
                    }
                    placeholder="Step title"
                    className="w-full rounded border border-primary-300 bg-white px-2 py-1 text-sm font-medium text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateStep(index, "description", e.target.value)
                    }
                    placeholder="Step description"
                    rows={2}
                    className="w-full rounded border border-primary-300 bg-white px-2 py-1 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeStep(index)}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 size={12} />
                    Remove
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="rounded-lg border-l-4 border-secondary-400 bg-secondary-50 p-4"
                  whileHover={{ boxShadow: "0 4px 12px rgba(142, 151, 117, 0.1)" }}
                >
                  <h4 className="font-semibold text-primary-700">
                    {step.title}
                  </h4>
                  <p className="text-sm text-primary-600 mt-1">
                    {step.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Step Button */}
        {isEditing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addStep}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-secondary-300 bg-secondary-50 px-4 py-2 text-sm font-medium text-secondary-600 hover:border-secondary-400 hover:bg-secondary-100"
          >
            <Plus size={16} />
            Add Step
          </motion.button>
        )}
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <motion.div className="mt-6 flex gap-2 pt-4 border-t border-primary-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Save Timeline
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditSteps(steps);
              setIsEditing(false);
            }}
            className="flex-1 rounded border border-primary-300 bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
          >
            Cancel
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
