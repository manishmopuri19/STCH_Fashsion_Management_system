export const statsData = [
  {
    title: "RFQs",
    value: 128,
    change: "+12%",
  },
  {
    title: "Orders",
    value: 42,
    change: "+8%",
  },
  {
    title: "Delays",
    value: 5,
    change: "+1%",
  },
  {
    title: "Suppliers",
    value: 18,
    change: "+3%",
  },
];

export const rfqPipeline = [
  {
    stage: "New RFQ",
    count: 12,
  },
  {
    stage: "Costing",
    count: 8,
  },
  {
    stage: "Supplier Match",
    count: 6,
  },
  {
    stage: "Sampling",
    count: 4,
  },
  {
    stage: "PO Approved",
    count: 3,
  },
];

export const orderPipeline = [
  {
    stage: "TNA Pending",
    count: 7,
  },
  {
    stage: "Production",
    count: 14,
  },
  {
    stage: "QC",
    count: 5,
  },
  {
    stage: "Ready To Ship",
    count: 3,
  },
  {
    stage: "Delivered",
    count: 18,
  },
];

export const activities = [
  "RFQ #104 created",
  "QC failed for Order #82",
  "Shipment dispatched for PO #204",
  "Supplier assigned to RFQ #99",
];