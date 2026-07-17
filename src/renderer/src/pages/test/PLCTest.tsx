// import { Button, Flex, NumberInput, Text } from "@mantine/core";
// import { useEffect, useState } from "react";
// import {
//   ConfigMessageType,
//   PlcReadMessageType,
//   PlcWriteMessageType,
//   type ConfigWsMessage,
//   type PlcMessage,
// } from "../../../../server/src/shared/ws.const";

// const PLCTest = () => {
//   const [messages, setMessages] = useState([]);
//   const [configWs, setConfigWs] = useState<WebSocket>();
//   const [plcWriteWs, setPlcWriteWs] = useState<WebSocket>();
//   const [plcStatus, setPlcStatus] = useState("Disconnected");
//   const [serverStatus, setServerStatus] = useState("Disconnected");
//   const [m101Value, setM101Value] = useState<string | number>(0);

//   const sendWsMessage = (ws: WebSocket | undefined, message: object) => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(message));
//       addMessage("Client", message, "sent");
//     } else {
//       console.error("WebSocket is not connected");
//     }
//   };

//   // Add message to the messages array
//   const addMessage = (sender: string, content: any, type: any) => {
//     const message = {
//       id: Date.now() + Math.random(),
//       sender,
//       content,
//       type,
//       timestamp: new Date().toLocaleTimeString(),
//     };
//     setMessages((prev) => [...prev, message]);
//   };

//   const connectAllWs = () => {
//     // Connect to all WebSocket endpoints
//     connectConfigWS();
//     connectPlcReadWs();
//     connectPlcWriteWs();
//   };

//   const handlePlcReadWsMessage = (message: PlcMessage) => {
//     switch (message.type) {
//       case PlcReadMessageType.PLC_READ_RESPONSE_SUCCESS:
//         console.log("PLC Read Response:", message.data);
//         addMessage("PLC", message.data, "received");
//         break;
//       default:
//         console.warn("Unhandled PLC message type:", message.type);
//     }
//   };

//   const handleConfigWsMessage = (message: ConfigWsMessage) => {
//     switch (message.type) {
//       case ConfigMessageType.PLC_CONNECTION_STATUS:
//         setPlcStatus(message.data.plcIsConnected ? "Connected" : "Disconnected");
//         setServerStatus(message.data.error ? "Error: " + message.data.error : "Connected");
//         break;
//       // case ConfigMessageType.PLC_CHECK_CONNECTION:
//       //   if (message.data.plcIsConnected) {
//       //     setPlcStatus("Connected");
//       //     setServerStatus("Connected");
//       //   } else {
//       //     setPlcStatus("Disconnected");
//       //     setServerStatus("Disconnected");
//       //   }
//       //   break;
//       default:
//         console.warn("Unhandled message type:", message.type);
//     }
//   };

//   const connectPlcReadWs = () => {
//     const plcReadWs = new WebSocket("ws://localhost:4000/ws/plc-read");

//     plcReadWs.onopen = () => {
//       console.log("WebSocket connected");
//       sendWsMessage(plcReadWs);
//     };

//     plcReadWs.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       handlePlcReadWsMessage(message);

//       console.log("Received message:", message);
//       addMessage("Server", message, "received");
//     };
//   };

//   const connectPlcWriteWs = () => {
//     const _plcWriteWs = new WebSocket("ws://localhost:4000/ws/plc-write");
//     setPlcWriteWs(_plcWriteWs);

//     _plcWriteWs.onopen = () => {
//       console.log("WebSocket connected");
//       // sendWsMessage(plcWriteWs);
//     };

//     _plcWriteWs.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       handlePlcReadWsMessage(message);

//       console.log("Received message:", message);
//       addMessage("Server", message, "received");
//     };
//   };

//   const connectConfigWS = () => {
//     const _configWs = new WebSocket("ws://localhost:4000/ws/plc");
//     setConfigWs(_configWs);
//     console.log(configWs);

//     _configWs.onopen = () => {
//       console.log("WebSocket connected");
//       _configWs.send(JSON.stringify({ action: "subscribe", id: "manual" }));
//     };

//     _configWs.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       handleConfigWsMessage(data);
//       console.log("Received message:", data);
//       addMessage("Server", data, "received");
//     };

//     _configWs.onclose = () => {
//       console.log("WebSocket connection closed");
//       setPlcStatus("Disconnected");
//       setServerStatus("Disconnected");
//     };
//   };

//   const handleConnectPLC = () => {
//     const message: ConfigWsMessage = {
//       type: ConfigMessageType.PLC_CONNECT,
//     };

//     sendWsMessage(configWs, message);
//   };

//   const handleDisconnectPLC = () => {
//     const message: ConfigWsMessage = {
//       type: ConfigMessageType.PLC_DISCONNECT,
//     };

//     sendWsMessage(configWs, message);
//   };

//   const handleCheckPLCConnection = () => {
//     const message: ConfigWsMessage = {
//       type: ConfigMessageType.PLC_CHECK_CONNECTION,
//     };

//     sendWsMessage(configWs, message);
//   };

//   const handleM101Update = () => {
//     const message: PlcMessage = {
//       type: PlcWriteMessageType.PLC_WRITE_REQUEST,
//       data: {
//         address: ["M101"],
//         values: [m101Value],
//       },
//     };

//     sendWsMessage(plcWriteWs, message);
//     addMessage("Client", message, "sent");
//   };

//   useEffect(() => {
//     if (configWs && configWs.readyState === WebSocket.OPEN) {
//       configWs.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log("Received message:", data);
//         addMessage("Server", data, "received");
//       };
//     }
//   }, [configWs]);

//   return (
//     <Flex direction="column" align="center" justify="center" rowGap={20} mt={20}>
//       <Text size="xl">Current PLC Status: {plcStatus}</Text>
//       <Text size="xl">Current Server Status: {serverStatus}</Text>
//       <Button onClick={connectAllWs}>Connect All WS</Button>
//       <Button onClick={handleConnectPLC}>Connect to PLC</Button>
//       <Button onClick={handleDisconnectPLC} c={"red"} variant="outline">
//         Disconnect PLC
//       </Button>
//       <Button onClick={handleCheckPLCConnection} c={"red"} variant="outline">
//         Check PLC Connection
//       </Button>
//       <NumberInput label="M101" description="Enter value" placeholder="0" value={m101Value} onChange={setM101Value} />
//       <Button onClick={handleM101Update}>Update</Button>
//       {messages.map((msg, index) => (
//         <Flex key={index}>
//           <Text>{JSON.stringify(msg.content, null, 2)}</Text>
//         </Flex>
//       ))}
//     </Flex>
//   );
// };

// export default PLCTest;

function PLCTest() {
  return <div>PLCTest</div>
}

export default PLCTest
