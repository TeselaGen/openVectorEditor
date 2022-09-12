export const getListStyle = (
  isDraggingOver
  /* isDragging */
) => {
  return {
    // ...(isDragging && { opacity: 0.7, zIndex: 10000, background: "lightgrey" }),
    ...(isDraggingOver && {
      background: "#e5f3ff"
    })
  };
};
