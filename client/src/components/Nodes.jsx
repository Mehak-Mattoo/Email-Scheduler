// Defining node types and their custom components if needed
export const nodeTypes = {
  coldEmailNode: ({ data }) => (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#fff",
        border: "1px solid black",
      }}
    >
      <strong>Cold Email</strong>
      <div>{data.label}</div>
    </div>
  ),
  waitNode: ({ data }) => (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        border: "1px solid gray",
      }}
    >
      <strong>Wait/Delay</strong>
      <div>{data.label}</div>
    </div>
  ),
};

// Initial nodes for ReactFlow
export const initialNodes = [
  {
    id: "1",
    type: "coldEmailNode", // this uses the custom node type defined above
    position: { x: 250, y: 25 },
    data: { label: "Send Cold Email" },
  },
  {
    id: "2",
    type: "waitNode", // this uses the custom node type defined above
    position: { x: 250, y: 125 },
    data: { label: "Wait/Delay" },
  },
];

// Initial edges connecting nodes
export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    label: "Wait for response",
  },
];
