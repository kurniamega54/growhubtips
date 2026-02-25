"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Droplet,
  Leaf,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

interface PlantCareData {
  lightLevel: "low" | "medium" | "high";
  waterFrequency: string;
  soilType: string;
  petSafe: boolean;
}

export function PlantCareCardComponent(props: any) {
  const { node, updateAttributes } = props;
  const { lightLevel, waterFrequency, soilType, petSafe } = (node.attrs || {}) as PlantCareData;
  const [isEditing, setIsEditing] = useState(false);

  const lightLabels: Record<string, string> = {
    low: "Low Light",
    medium: "Medium Light",
    high: "Full Sun",
  };

  const updateField = (field: keyof PlantCareData, value: any) => {
    updateAttributes({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6 rounded-2xl border-2 border-secondary-300 bg-secondary-50 p-6 shadow-organic"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-700 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-secondary-600" />
          Plant Care Guide
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Light */}
        <motion.div
          className="rounded-xl bg-white p-4 border border-secondary-200"
          whileHover={{ scale: isEditing ? 1 : 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-accent-500" />
            <p className="text-xs font-semibold text-primary-600 uppercase">
              Light
            </p>
          </div>
          {isEditing ? (
            <select
              value={lightLevel}
              onChange={(e) =>
                updateField(
                  "lightLevel",
                  e.target.value as "low" | "medium" | "high"
                )
              }
              className="w-full rounded border border-primary-300 bg-white px-2 py-2 text-sm text-primary-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="low">Low Light</option>
              <option value="medium">Medium Light</option>
              <option value="high">Full Sun</option>
            </select>
          ) : (
            <p className="text-sm font-medium text-primary-700">
              {lightLabels[lightLevel]}
            </p>
          )}
        </motion.div>

        {/* Water */}
        <motion.div
          className="rounded-xl bg-white p-4 border border-secondary-200"
          whileHover={{ scale: isEditing ? 1 : 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="h-5 w-5 text-accent-500" />
            <p className="text-xs font-semibold text-primary-600 uppercase">
              Water
            </p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={waterFrequency}
              onChange={(e) => updateField("waterFrequency", e.target.value)}
              placeholder="e.g., Every 3 days"
              className="w-full rounded border border-primary-300 bg-white px-2 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm font-medium text-primary-700">
              {waterFrequency || "Every 3-5 days"}
            </p>
          )}
        </motion.div>

        {/* Soil */}
        <motion.div
          className="rounded-xl bg-white p-4 border border-secondary-200 col-span-2"
          whileHover={{ scale: isEditing ? 1 : 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-accent-500" />
            <p className="text-xs font-semibold text-primary-600 uppercase">
              Soil Type
            </p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={soilType}
              onChange={(e) => updateField("soilType", e.target.value)}
              placeholder="e.g., Well-draining loam"
              className="w-full rounded border border-primary-300 bg-white px-2 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm font-medium text-primary-700">
              {soilType || "Well-draining soil"}
            </p>
          )}
        </motion.div>

        {/* Pet Safety */}
        <motion.div className="rounded-xl bg-white p-4 border border-secondary-200 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-secondary-600" />
              <p className="text-xs font-semibold text-primary-600 uppercase">
                Pet Safe
              </p>
            </div>
            {isEditing ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateField("petSafe", !petSafe)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  petSafe ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <motion.span
                  initial={false}
                  animate={{ x: petSafe ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-block h-4 w-4 transform rounded-full bg-white"
                />
              </motion.button>
            ) : (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  petSafe
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {petSafe ? (
                  <>
                    <Check size={14} />
                    <span className="text-xs font-medium">Safe</span>
                  </>
                ) : (
                  <>
                    <X size={14} />
                    <span className="text-xs font-medium">Toxic</span>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
