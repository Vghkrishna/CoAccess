import Swal from "sweetalert2";

const elevateZIndex = () => {
  const container = document.querySelector(".swal2-container");
  if (container) {
    container.style.zIndex = "2000"; // or 9999 if needed
  }
};

// Success Alert
export const showSuccess = (message) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#3085d6",
    didOpen: elevateZIndex,
  });
};

// Error Alert
export const showError = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    confirmButtonColor: "#d33",
    didOpen: elevateZIndex,
  });
};

// Info Alert
export const showInfo = (message) => {
  Swal.fire({
    icon: "info",
    title: "Info",
    text: message,
    confirmButtonColor: "#3085d6",
    didOpen: elevateZIndex,
  });
};

// Confirm Alert
export const showConfirm = async (text = "Are you sure?") => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    didOpen: elevateZIndex,
  });
  return result.isConfirmed;
};
