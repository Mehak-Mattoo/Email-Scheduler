import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { Modal, Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Lead Source" },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    data: { label: "Cold Email" },
    position: { x: 400, y: 100 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Wait/Delay" },
    position: { x: 700, y: 100 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

const emailAPI = import.meta.env.VITE_AUTH_BACKEND; // Replace with your backend URL

const MyComponent = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [openModal, setOpenModal] = useState(false);
  const [emailDetails, setEmailDetails] = useState({
    to: "",
    subject: "",
    body: "",
    delay: "",
  });

  const handleNodeClick = useCallback((event, node) => {
    if (node.data.label === "Cold Email") {
      setOpenModal(true);
    } else if (node.data.label === "Wait/Delay") {
      setOpenModal(true);
    }
  }, []);

  const handleModalClose = () => setOpenModal(false);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(emailAPI, emailDetails);
      console.log("Email scheduled:", response.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Error scheduling email:", error);
    }
  };

  return (
    <>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onNodeClick={handleNodeClick}
        />
      </ReactFlowProvider>

      {/* Modal for Email Details or Delay */}
      <Modal open={openModal} onClose={handleModalClose}>
        <form onSubmit={handleSubmitEmail}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Schedule Email</h2>
            <Input
              type="email"
              name="to"
              value={emailDetails.to}
              onChange={handleEmailChange}
              label="Recipient Email"
              required
            />
            <Input
              type="text"
              name="subject"
              value={emailDetails.subject}
              onChange={handleEmailChange}
              label="Subject"
              required
            />
            <Textarea
              name="body"
              value={emailDetails.body}
              onChange={handleEmailChange}
              label="Body"
              required
            />
            <Input
              type="number"
              name="delay"
              value={emailDetails.delay}
              onChange={handleEmailChange}
              label="Delay (hours)"
              required
            />
            <div className="mt-4 flex justify-end">
              <Button type="submit" color="green">
                Schedule Email
              </Button>
              <Button color="gray" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};


export default MyComponent;
