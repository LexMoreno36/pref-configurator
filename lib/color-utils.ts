import { Color3 } from "@babylonjs/core/Maths/math.color"

// Color mapping for all components
export const colorMap: Record<string, string> = {
  // Original mappings
  "7009": "#4D5645", // Green grey
  "7016": "#293133", // Anthracite grey
  "7021": "#23282B", // Black grey
  "7022": "#32352A", // Umbra grey
  "7037": "#7D7F7D", // Dusty grey
  "7039": "#6C6960", // Quartz grey
  "7043": "#4E5452", // Traffic grey
  "8014": "#382C1E", // Sepia brown
  "8019": "#403A3A", // Grey brown
  "8022": "#212121", // Black brown
  "9004": "#2C2C2C", // Signal black
  "9005": "#0A0A0A", // Jet black
  "9006": "#A5A5A5", // White aluminium
  "9010": "#FFFFFF", // Pure white
  "9011": "#1C1C1C", // Graphite black
  "9016": "#F6F6F6", // Traffic white

  // New format mappings (with T)
  "7T09": "#4D5645", // Green grey
  "7T16": "#293133", // Anthracite grey
  "7T21": "#23282B", // Black grey
  "7T22": "#32352A", // Umbra grey
  "7T37": "#7D7F7D", // Dusty grey
  "7T39": "#6C6960", // Quartz grey
  "7T43": "#4E5452", // Traffic grey
  "8T14": "#382C1E", // Sepia brown
  "8T19": "#403A3A", // Grey brown
  "8T22": "#212121", // Black brown
  "9T04": "#2C2C2C", // Signal black
  "9T05": "#0A0A0A", // Jet black
  "9T06": "#A5A5A5", // White aluminium
  "9T10": "#FFFFFF", // Pure white
  "9T11": "#1C1C1C", // Graphite black
  "9T16": "#F6F6F6", // Traffic white

  // New format mappings (with M)
  "7M09": "#4D5645", // Green grey
  "7M16": "#293133", // Anthracite grey
  "7M21": "#23282B", // Black grey
  "7M22": "#32352A", // Umbra grey
  "7M37": "#7D7F7D", // Dusty grey
  "7M39": "#6C6960", // Quartz grey
  "7M43": "#4E5452", // Traffic grey
  "8M14": "#382C1E", // Sepia brown
  "8M19": "#403A3A", // Grey brown
  "8M22": "#212121", // Black brown
  "9M04": "#2C2C2C", // Signal black
  "9M05": "#0A0A0A", // Jet black
  "9M06": "#A5A5A5", // White aluminium
  "9M10": "#FFFFFF", // Pure white
  "9M11": "#1C1C1C", // Graphite black
  "9M16": "#F6F6F6", // Traffic white

  // Special codes
  "17": "#C0C0C0", // Silver
  C33: "#B5A642", // Brass
  C35: "#B87333", // Copper
  CH2: "#CD7F32", // Bronze

  // Prefixed codes (45_, 49_, 55_, 59_, 75_, 79_)
  "45_7T09": "#4D5645", // Green grey
  "45_7T16": "#293133", // Anthracite grey
  "45_7T21": "#23282B", // Black grey
  "45_7T22": "#32352A", // Umbra grey
  "45_7T37": "#7D7F7D", // Dusty grey
  "45_7T39": "#6C6960", // Quartz grey
  "45_7T43": "#4E5452", // Traffic grey
  "45_8T14": "#382C1E", // Sepia brown
  "45_8T19": "#403A3A", // Grey brown
  "45_8T22": "#212121", // Black brown
  "45_9T04": "#2C2C2C", // Signal black
  "45_9T05": "#0A0A0A", // Jet black
  "45_9T06": "#A5A5A5", // White aluminium
  "45_9T10": "#FFFFFF", // Pure white
  "45_9T11": "#1C1C1C", // Graphite black
  "45_9T16": "#F6F6F6", // Traffic white

  "49_7T09": "#4D5645", // Green grey
  "49_7T16": "#293133", // Anthracite grey
  "49_7T21": "#23282B", // Black grey
  "49_7T22": "#32352A", // Umbra grey
  "49_7T37": "#7D7F7D", // Dusty grey
  "49_7T39": "#6C6960", // Quartz grey
  "49_7T43": "#4E5452", // Traffic grey
  "49_8T14": "#382C1E", // Sepia brown
  "49_8T19": "#403A3A", // Grey brown
  "49_8T22": "#212121", // Black brown
  "49_9T04": "#2C2C2C", // Signal black
  "49_9T05": "#0A0A0A", // Jet black
  "49_9T06": "#A5A5A5", // White aluminium
  "49_9T10": "#FFFFFF", // Pure white
  "49_9T11": "#1C1C1C", // Graphite black
  "49_9T16": "#F6F6F6", // Traffic white

  "55_7009": "#4D5645", // Green grey
  "55_7016": "#293133", // Anthracite grey
  "55_7021": "#23282B", // Black grey
  "55_7022": "#32352A", // Umbra grey
  "55_7037": "#7D7F7D", // Dusty grey
  "55_7039": "#6C6960", // Quartz grey
  "55_7043": "#4E5452", // Traffic grey
  "55_8014": "#382C1E", // Sepia brown
  "55_8019": "#403A3A", // Grey brown
  "55_8022": "#212121", // Black brown
  "55_9004": "#2C2C2C", // Signal black
  "55_9005": "#0A0A0A", // Jet black
  "55_9006": "#A5A5A5", // White aluminium
  "55_9010": "#FFFFFF", // Pure white
  "55_9011": "#1C1C1C", // Graphite black
  "55_9016": "#F6F6F6", // Traffic white

  "59_7009": "#4D5645", // Green grey
  "59_7016": "#293133", // Anthracite grey
  "59_7021": "#23282B", // Black grey
  "59_7022": "#32352A", // Umbra grey
  "59_7037": "#7D7F7D", // Dusty grey
  "59_7039": "#6C6960", // Quartz grey
  "59_7043": "#4E5452", // Traffic grey
  "59_8014": "#382C1E", // Sepia brown
  "59_8019": "#403A3A", // Grey brown
  "59_8022": "#212121", // Black brown
  "59_9004": "#2C2C2C", // Signal black
  "59_9005": "#0A0A0A", // Jet black
  "59_9006": "#A5A5A5", // White aluminium
  "59_9010": "#FFFFFF", // Pure white
  "59_9011": "#1C1C1C", // Graphite black
  "59_9016": "#F6F6F6", // Traffic white

  "75_7M09": "#4D5645", // Green grey
  "75_7M16": "#293133", // Anthracite grey
  "75_7M21": "#23282B", // Black grey
  "75_7M22": "#32352A", // Umbra grey
  "75_7M37": "#7D7F7D", // Dusty grey
  "75_7M39": "#6C6960", // Quartz grey
  "75_7M43": "#4E5452", // Traffic grey
  "75_8M14": "#382C1E", // Sepia brown
  "75_8M19": "#403A3A", // Grey brown
  "75_8M22": "#212121", // Black brown
  "75_9M04": "#2C2C2C", // Signal black
  "75_9M05": "#0A0A0A", // Jet black
  "75_9M06": "#A5A5A5", // White aluminium
  "75_9M10": "#FFFFFF", // Pure white
  "75_9M11": "#1C1C1C", // Graphite black
  "75_9M16": "#F6F6F6", // Traffic white

  "79_7M09": "#4D5645", // Green grey
  "79_7M16": "#293133", // Anthracite grey
  "79_7M21": "#23282B", // Black grey
  "79_7M22": "#32352A", // Umbra grey
  "79_7M37": "#7D7F7D", // Dusty grey
  "79_7M39": "#6C6960", // Quartz grey
  "79_7M43": "#4E5452", // Traffic grey
  "79_8M14": "#382C1E", // Sepia brown
  "79_8M19": "#403A3A", // Grey brown
  "79_8M22": "#212121", // Black brown
  "79_9M04": "#2C2C2C", // Signal black
  "79_9M05": "#0A0A0A", // Jet black
  "79_9M06": "#A5A5A5", // White aluminium
  "79_9M10": "#FFFFFF", // Pure white
  "79_9M11": "#1C1C1C", // Graphite black
  "79_9M16": "#F6F6F6", // Traffic white
}

// Color mapping for 3D components (BabylonJS)
export const color3Map: Record<string, Color3> = {
  // Original mappings
  "7009": new Color3(0.3, 0.35, 0.27), // Green grey
  "7016": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "7021": new Color3(0.14, 0.16, 0.17), // Black grey
  "7022": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "7037": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "7039": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "7043": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "8014": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "8019": new Color3(0.25, 0.23, 0.23), // Grey brown
  "8022": new Color3(0.13, 0.13, 0.13), // Black brown
  "9004": new Color3(0.17, 0.17, 0.17), // Signal black
  "9005": new Color3(0.05, 0.05, 0.05), // Jet black
  "9006": new Color3(0.65, 0.65, 0.65), // White aluminium
  "9010": new Color3(0.95, 0.95, 0.95), // Pure white
  "9011": new Color3(0.11, 0.11, 0.11), // Graphite black
  "9016": new Color3(0.97, 0.97, 0.97), // Traffic white

  // New format mappings (with T)
  "7T09": new Color3(0.3, 0.35, 0.27), // Green grey
  "7T16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "7T21": new Color3(0.14, 0.16, 0.17), // Black grey
  "7T22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "7T37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "7T39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "7T43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "8T14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "8T19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "8T22": new Color3(0.13, 0.13, 0.13), // Black brown
  "9T04": new Color3(0.17, 0.17, 0.17), // Signal black
  "9T05": new Color3(0.05, 0.05, 0.05), // Jet black
  "9T06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "9T10": new Color3(0.95, 0.95, 0.95), // Pure white
  "9T11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "9T16": new Color3(0.97, 0.97, 0.97), // Traffic white

  // New format mappings (with M)
  "7M09": new Color3(0.3, 0.35, 0.27), // Green grey
  "7M16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "7M21": new Color3(0.14, 0.16, 0.17), // Black grey
  "7M22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "7M37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "7M39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "7M43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "8M14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "8M19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "8M22": new Color3(0.13, 0.13, 0.13), // Black brown
  "9M04": new Color3(0.17, 0.17, 0.17), // Signal black
  "9M05": new Color3(0.05, 0.05, 0.05), // Jet black
  "9M06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "9M10": new Color3(0.95, 0.95, 0.95), // Pure white
  "9M11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "9M16": new Color3(0.97, 0.97, 0.97), // Traffic white

  // Special codes
  "17": new Color3(0.75, 0.75, 0.75), // Silver
  C33: new Color3(0.71, 0.65, 0.26), // Brass
  C35: new Color3(0.72, 0.45, 0.2), // Copper
  CH2: new Color3(0.8, 0.5, 0.2), // Bronze

  // Prefixed codes (45_, 49_, 55_, 59_, 75_, 79_)
  "45_7T09": new Color3(0.3, 0.35, 0.27), // Green grey
  "45_7T16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "45_7T21": new Color3(0.14, 0.16, 0.17), // Black grey
  "45_7T22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "45_7T37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "45_7T39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "45_7T43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "45_8T14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "45_8T19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "45_8T22": new Color3(0.13, 0.13, 0.13), // Black brown
  "45_9T04": new Color3(0.17, 0.17, 0.17), // Signal black
  "45_9T05": new Color3(0.05, 0.05, 0.05), // Jet black
  "45_9T06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "45_9T10": new Color3(0.95, 0.95, 0.95), // Pure white
  "45_9T11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "45_9T16": new Color3(0.97, 0.97, 0.97), // Traffic white

  "49_7T09": new Color3(0.3, 0.35, 0.27), // Green grey
  "49_7T16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "49_7T21": new Color3(0.14, 0.16, 0.17), // Black grey
  "49_7T22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "49_7T37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "49_7T39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "49_7T43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "49_8T14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "49_8T19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "49_8T22": new Color3(0.13, 0.13, 0.13), // Black brown
  "49_9T04": new Color3(0.17, 0.17, 0.17), // Signal black
  "49_9T05": new Color3(0.05, 0.05, 0.05), // Jet black
  "49_9T06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "49_9T10": new Color3(0.95, 0.95, 0.95), // Pure white
  "49_9T11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "49_9T16": new Color3(0.97, 0.97, 0.97), // Traffic white

  "55_7009": new Color3(0.3, 0.35, 0.27), // Green grey
  "55_7016": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "55_7021": new Color3(0.14, 0.16, 0.17), // Black grey
  "55_7022": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "55_7037": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "55_7039": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "55_7043": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "55_8014": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "55_8019": new Color3(0.25, 0.23, 0.23), // Grey brown
  "55_8022": new Color3(0.13, 0.13, 0.13), // Black brown
  "55_9004": new Color3(0.17, 0.17, 0.17), // Signal black
  "55_9005": new Color3(0.05, 0.05, 0.05), // Jet black
  "55_9006": new Color3(0.65, 0.65, 0.65), // White aluminium
  "55_9010": new Color3(0.95, 0.95, 0.95), // Pure white
  "55_9011": new Color3(0.11, 0.11, 0.11), // Graphite black
  "55_9016": new Color3(0.97, 0.97, 0.97), // Traffic white

  "59_7009": new Color3(0.3, 0.35, 0.27), // Green grey
  "59_7016": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "59_7021": new Color3(0.14, 0.16, 0.17), // Black grey
  "59_7022": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "59_7037": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "59_7039": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "59_7043": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "59_8014": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "59_8019": new Color3(0.25, 0.23, 0.23), // Grey brown
  "59_8022": new Color3(0.13, 0.13, 0.13), // Black brown
  "59_9004": new Color3(0.17, 0.17, 0.17), // Signal black
  "59_9005": new Color3(0.05, 0.05, 0.05), // Jet black
  "59_9006": new Color3(0.65, 0.65, 0.65), // White aluminium
  "59_9010": new Color3(0.95, 0.95, 0.95), // Pure white
  "59_9011": new Color3(0.11, 0.11, 0.11), // Graphite black
  "59_9016": new Color3(0.97, 0.97, 0.97), // Traffic white

  "75_7M09": new Color3(0.3, 0.35, 0.27), // Green grey
  "75_7M16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "75_7M21": new Color3(0.14, 0.16, 0.17), // Black grey
  "75_7M22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "75_7M37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "75_7M39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "75_7M43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "75_8M14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "75_8M19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "75_8M22": new Color3(0.13, 0.13, 0.13), // Black brown
  "75_9M04": new Color3(0.17, 0.17, 0.17), // Signal black
  "75_9M05": new Color3(0.05, 0.05, 0.05), // Jet black
  "75_9M06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "75_9M10": new Color3(0.95, 0.95, 0.95), // Pure white
  "75_9M11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "75_9M16": new Color3(0.97, 0.97, 0.97), // Traffic white

  "79_7M09": new Color3(0.3, 0.35, 0.27), // Green grey
  "79_7M16": new Color3(0.16, 0.19, 0.2), // Anthracite grey
  "79_7M21": new Color3(0.14, 0.16, 0.17), // Black grey
  "79_7M22": new Color3(0.2, 0.21, 0.16), // Umbra grey
  "79_7M37": new Color3(0.49, 0.5, 0.49), // Dusty grey
  "79_7M39": new Color3(0.42, 0.41, 0.38), // Quartz grey
  "79_7M43": new Color3(0.3, 0.33, 0.32), // Traffic grey
  "79_8M14": new Color3(0.22, 0.17, 0.12), // Sepia brown
  "79_8M19": new Color3(0.25, 0.23, 0.23), // Grey brown
  "79_8M22": new Color3(0.13, 0.13, 0.13), // Black brown
  "79_9M04": new Color3(0.17, 0.17, 0.17), // Signal black
  "79_9M05": new Color3(0.05, 0.05, 0.05), // Jet black
  "79_9M06": new Color3(0.65, 0.65, 0.65), // White aluminium
  "79_9M10": new Color3(0.95, 0.95, 0.95), // Pure white
  "79_9M11": new Color3(0.11, 0.11, 0.11), // Graphite black
  "79_9M16": new Color3(0.97, 0.97, 0.97), // Traffic white
}

// Color names for tooltips and display
export const colorNames: Record<string, string> = {
  "7009": "Green Grey",
  "7016": "Anthracite Grey",
  "7021": "Black Grey",
  "7022": "Umbra Grey",
  "7037": "Dusty Grey",
  "7039": "Quartz Grey",
  "7043": "Traffic Grey",
  "8014": "Sepia Brown",
  "8019": "Grey Brown",
  "8022": "Black Brown",
  "9004": "Signal Black",
  "9005": "Jet Black",
  "9006": "White Aluminium",
  "9010": "Pure White",
  "9011": "Graphite Black",
  "9016": "Traffic White",

  // New format mappings (with T)
  "7T09": "Green Grey",
  "7T16": "Anthracite Grey",
  "7T21": "Black Grey",
  "7T22": "Umbra Grey",
  "7T37": "Dusty Grey",
  "7T39": "Quartz Grey",
  "7T43": "Traffic Grey",
  "8T14": "Sepia Brown",
  "8T19": "Grey Brown",
  "8T22": "Black Brown",
  "9T04": "Signal Black",
  "9T05": "Jet Black",
  "9T06": "White Aluminium",
  "9T10": "Pure White",
  "9T11": "Graphite Black",
  "9T16": "Traffic White",

  // New format mappings (with M)
  "7M09": "Green Grey",
  "7M16": "Anthracite Grey",
  "7M21": "Black Grey",
  "7M22": "Umbra Grey",
  "7M37": "Dusty Grey",
  "7M39": "Quartz Grey",
  "7M43": "Traffic Grey",
  "8M14": "Sepia Brown",
  "8M19": "Grey Brown",
  "8M22": "Black Brown",
  "9M04": "Signal Black",
  "9M05": "Jet Black",
  "9M06": "White Aluminium",
  "9M10": "Pure White",
  "9M11": "Graphite Black",
  "9M16": "Traffic White",

  // Special codes
  "17": "Silver",
  C33: "Brass",
  C35: "Copper",
  CH2: "Bronze",

  // Prefixed codes (45_, 49_, 55_, 59_, 75_, 79_)
  "45_7T09": "Green Grey (45)",
  "45_7T16": "Anthracite Grey (45)",
  "45_7T21": "Black Grey (45)",
  "45_7T22": "Umbra Grey (45)",
  "45_7T37": "Dusty Grey (45)",
  "45_7T39": "Quartz Grey (45)",
  "45_7T43": "Traffic Grey (45)",
  "45_8T14": "Sepia Brown (45)",
  "45_8T19": "Grey Brown (45)",
  "45_8T22": "Black Brown (45)",
  "45_9T04": "Signal Black (45)",
  "45_9T05": "Jet Black (45)",
  "45_9T06": "White Aluminium (45)",
  "45_9T10": "Pure White (45)",
  "45_9T11": "Graphite Black (45)",
  "45_9T16": "Traffic White (45)",

  "49_7T09": "Green Grey (49)",
  "49_7T16": "Anthracite Grey (49)",
  "49_7T21": "Black Grey (49)",
  "49_7T22": "Umbra Grey (49)",
  "49_7T37": "Dusty Grey (49)",
  "49_7T39": "Quartz Grey (49)",
  "49_7T43": "Traffic Grey (49)",
  "49_8T14": "Sepia Brown (49)",
  "49_8T19": "Grey Brown (49)",
  "49_8T22": "Black Brown (49)",
  "49_9T04": "Signal Black (49)",
  "49_9T05": "Jet Black (49)",
  "49_9T06": "White Aluminium (49)",
  "49_9T10": "Pure White (49)",
  "49_9T11": "Graphite Black (49)",
  "49_9T16": "Traffic White (49)",

  "55_7009": "Green Grey (55)",
  "55_7016": "Anthracite Grey (55)",
  "55_7021": "Black Grey (55)",
  "55_7022": "Umbra Grey (55)",
  "55_7037": "Dusty Grey (55)",
  "55_7039": "Quartz Grey (55)",
  "55_7043": "Traffic Grey (55)",
  "55_8014": "Sepia Brown (55)",
  "55_8019": "Grey Brown (55)",
  "55_8022": "Black Brown (55)",
  "55_9004": "Signal Black (55)",
  "55_9005": "Jet Black (55)",
  "55_9006": "White Aluminium (55)",
  "55_9010": "Pure White (55)",
  "55_9011": "Graphite Black (55)",
  "55_9016": "Traffic White (55)",

  "59_7009": "Green Grey (59)",
  "59_7016": "Anthracite Grey (59)",
  "59_7021": "Black Grey (59)",
  "59_7022": "Umbra Grey (59)",
  "59_7037": "Dusty Grey (59)",
  "59_7039": "Quartz Grey (59)",
  "59_7043": "Traffic Grey (59)",
  "59_8014": "Sepia Brown (59)",
  "59_8019": "Grey Brown (59)",
  "59_8022": "Black Brown (59)",
  "59_9004": "Signal Black (59)",
  "59_9005": "Jet Black (59)",
  "59_9006": "White Aluminium (59)",
  "59_9010": "Pure White (59)",
  "59_9011": "Graphite Black (59)",
  "59_9016": "Traffic White (59)",

  "75_7M09": "Green Grey (75)",
  "75_7M16": "Anthracite Grey (75)",
  "75_7M21": "Black Grey (75)",
  "75_7M22": "Umbra Grey (75)",
  "75_7M37": "Dusty Grey (75)",
  "75_7M39": "Quartz Grey (75)",
  "75_7M43": "Traffic Grey (75)",
  "75_8M14": "Sepia Brown (75)",
  "75_8M19": "Grey Brown (75)",
  "75_8M22": "Black Brown (75)",
  "75_9M04": "Signal Black (75)",
  "75_9M05": "Jet Black (75)",
  "75_9M06": "White Aluminium (75)",
  "75_9M10": "Pure White (75)",
  "75_9M11": "Graphite Black (75)",
  "75_9M16": "Traffic White (75)",

  "79_7M09": "Green Grey (79)",
  "79_7M16": "Anthracite Grey (79)",
  "79_7M21": "Black Grey (79)",
  "79_7M22": "Umbra Grey (79)",
  "79_7M37": "Dusty Grey (79)",
  "79_7M39": "Quartz Grey (79)",
  "79_7M43": "Traffic Grey (79)",
  "79_8M14": "Sepia Brown (79)",
  "79_8M19": "Grey Brown (79)",
  "79_8M22": "Black Brown (79)",
  "79_9M04": "Signal Black (79)",
  "79_9M05": "Jet Black (79)",
  "79_9M06": "White Aluminium (79)",
  "79_9M10": "Pure White (79)",
  "79_9M11": "Graphite Black (79)",
  "79_9M16": "Traffic White (79)",
}

/**
 * Extract the color code from a color value string
 * Handles both old format (reynaers~7009) and new format (reynaers~45_7T09)
 */
export function extractColorCode(colorValue: string): string {
  if (!colorValue.includes("~")) return colorValue

  const parts = colorValue.split("~")
  const secondPart = parts[1]

  // Handle new format with underscore (e.g., 45_7T09)
  if (secondPart.includes("_")) {
    return secondPart
  }

  return secondPart
}

/**
 * Get the hex color for a color value
 * @param colorValue The color value string (e.g., reynaers~45_7T09)
 * @param defaultColor Default color to return if not found
 */
export function getHexColor(colorValue: string, defaultColor = "#888888"): string {
  const colorCode = extractColorCode(colorValue)
  return colorMap[colorCode] || defaultColor
}

/**
 * Get the Color3 object for a color value (for BabylonJS)
 * @param colorValue The color value string (e.g., reynaers~45_7T09)
 * @param defaultColor Default Color3 to return if not found
 */
export function getColor3(colorValue: string, defaultColor = new Color3(0.5, 0.5, 0.5)): Color3 {
  const colorCode = extractColorCode(colorValue)
  return color3Map[colorCode] || defaultColor
}

/**
 * Get the display name for a color value
 * @param colorValue The color value string (e.g., reynaers~45_7T09)
 */
export function getColorName(colorValue: string): string {
  const colorCode = extractColorCode(colorValue)
  return colorNames[colorCode] || colorCode
}
