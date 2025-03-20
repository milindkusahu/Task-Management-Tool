import React from "react";
import { Button } from "../../common";
import { BatchIcon } from "../../../utils/icons";

export interface BatchActionsProps {
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchComplete: () => void;
  onToggleMultiSelect: () => void;
  isMultiSelectActive: boolean;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  selectedCount,
  onBatchDelete,
  onBatchComplete,
  onToggleMultiSelect,
  isMultiSelectActive,
  onSelectAll,
  onClearSelection,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-100 rounded-md">
      <Button
        variant={isMultiSelectActive ? "primary" : "outline"}
        onClick={onToggleMultiSelect}
        size="sm"
        className="flex items-center gap-1"
      >
        <BatchIcon className="w-4 h-4" />
        <span>
          {isMultiSelectActive ? "Exit Multi-select" : "Multi-select"}
        </span>
      </Button>

      {isMultiSelectActive && (
        <>
          {selectedCount > 0 ? (
            <>
              <span className="text-sm text-gray-600 mx-2">
                {selectedCount} {selectedCount === 1 ? "task" : "tasks"}{" "}
                selected
              </span>
              <Button
                variant="outline"
                onClick={onBatchComplete}
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
                disabled={selectedCount === 0}
              >
                Mark as Complete
              </Button>
              <Button
                variant="outline"
                onClick={onBatchDelete}
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={selectedCount === 0}
              >
                Delete
              </Button>
              {onClearSelection && (
                <Button
                  variant="text"
                  onClick={onClearSelection}
                  size="sm"
                  disabled={selectedCount === 0}
                >
                  Clear Selection
                </Button>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-600 mx-2">
              Select tasks to perform batch actions
            </span>
          )}

          {onSelectAll && (
            <Button
              variant="text"
              onClick={onSelectAll}
              size="sm"
              className="ml-auto"
            >
              Select All
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default BatchActions;
