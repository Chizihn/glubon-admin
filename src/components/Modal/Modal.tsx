import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ModalPosition = "center" | "right";
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: ModalPosition;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "w-[400px]",
  md: "w-[600px]",
  lg: "w-[800px]",
  xl: "w-[1140px]",
  full: "w-[95%]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "",
  position = "right",
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
  overlayClassName = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseOverlayClasses =
    "fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200";
  const overlayClasses = twMerge(
    baseOverlayClasses,
    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    overlayClassName
  );

  const baseModalClasses =
    "fixed bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col overflow-hidden max-h-[95vh]";
  const positionClasses =
    position === "right"
      ? "top-0 right-0 h-screen animate-slide-in-right"
      : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[95%] max-h-[90vh] animate-scale-in";

  const modalClasses = twMerge(
    baseModalClasses,
    positionClasses,
    sizeClasses[size],
    position === "center" ? "rounded-lg" : "rounded-l-lg",
    className
  );

  const headerClasses = twMerge(
    "px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center",
    headerClassName
  );

  const contentClasses = twMerge(
    "p-6 overflow-y-auto flex-1",
    contentClassName
  );

  return (
    <>
      <div
        className={overlayClasses}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        <div className={headerClasses}>
          <h2 className="m-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
            >
              &times;
            </button>
          )}
        </div>
        <div className={contentClasses}>{children}</div>
      </div>
    </>
  );
};

export default Modal;

// Basic usage
{
  /* <Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="User Details"
  position="right" // or "center"
  size="md" // "sm", "md", "lg", "xl", "full"
  closeOnOverlayClick
  showCloseButton
  className="custom-modal" // Additional modal classes
  overlayClassName="custom-overlay" // Additional overlay classes
  headerClassName="custom-header" // Additional header classes
  contentClassName="custom-content" // Additional content classes
>
  <div>Your modal content here</div>
</Modal> */
}
