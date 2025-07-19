// src/shared/types.ts
function handleError(error, fallbackMessage = "An error occurred") {
  console.error("Resolver error:", error);
  throw new Error(error?.message || fallbackMessage);
}
function validateRequired(value, fieldName) {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
}
export {
  handleError,
  validateEmail,
  validateRequired
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NoYXJlZC90eXBlcy50cyJdLAogICJtYXBwaW5ncyI6ICI7QUF1Qk8sU0FBUyxZQUFZLE9BQVksa0JBQWtCLHFCQUFxQjtBQUM3RSxVQUFRLE1BQU0sbUJBQW1CLEtBQUs7QUFDdEMsUUFBTSxJQUFJLE1BQU0sT0FBTyxXQUFXLGVBQWU7QUFDbkQ7QUFHTyxTQUFTLGlCQUFpQixPQUFZLFdBQW1CO0FBQzlELE1BQUksQ0FBQyxPQUFPO0FBQ1YsVUFBTSxJQUFJLE1BQU0sR0FBRyxTQUFTLGNBQWM7QUFBQSxFQUM1QztBQUNGO0FBRU8sU0FBUyxjQUFjLE9BQWU7QUFDM0MsUUFBTSxhQUFhO0FBQ25CLE1BQUksQ0FBQyxXQUFXLEtBQUssS0FBSyxHQUFHO0FBQzNCLFVBQU0sSUFBSSxNQUFNLHNCQUFzQjtBQUFBLEVBQ3hDO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
