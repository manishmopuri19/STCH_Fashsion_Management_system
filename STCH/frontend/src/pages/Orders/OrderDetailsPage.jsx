// pages/orders/OrderDetailPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  CalendarDays,
  Shirt,
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Check,
  X,
  Clock,
  Calendar
} from "lucide-react";
import EmptyState
from "../../components/common/EmptyState";
const formatMoney = (value) =>
  Number(value || 0).toFixed(2);

/**
 * Calculates exactly how many days remain until the deadline.
 * Returns negative integers (-1, -2, etc.) if the date is past due and uncompleted.
 */
const calculateDaysRemaining = (plannedDateStr, currentStatus) => {
  if (currentStatus === "COMPLETED") {
    return { text: "Completed", value: 0, isOverdue: false };
  }
  if (!plannedDateStr) {
    return { text: "No Date Set", value: 0, isOverdue: false };
  }
  

  const deadline = new Date(plannedDateStr);
  const today = new Date();
  
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Exact negative integers for overdue offsets
    return { text: `${diffDays}`, value: diffDays, isOverdue: true };
  } else if (diffDays === 0) {
    return { text: "Due Today", value: 0, isOverdue: false };
  } else {
    return { text: `${diffDays} days left`, value: diffDays, isOverdue: false };
  }
};

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Core component states
  const [order, setOrder] = useState(null);
  const [tnaTasks, setTnaTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
  useState("");

const [unauthorized,
  setUnauthorized] =
  useState(false);
  // Add New TNA Modal context states
  const [showTnaModal, setShowTnaModal] = useState(false);
  const [targetColumn, setTargetColumn] = useState("");
  const [newActivity, setNewActivity] = useState({
    activity_type: "FABRIC_BOOKING",
    priority: "MEDIUM",
    planned_date: "",
    remarks: ""
  });

  // Inline TNA Edit state engines
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    planned_date: "",
    actual_date: "",
    remarks: "",
    priority: "MEDIUM"
  });

  useEffect(() => {
    fetchOrderAndTna();
  }, [id]);

  const fetchOrderAndTna = async () => {
    try {
      setLoading(true);
      const orderRes = await API.get(`/purchase-orders/${id}`);
      setOrder(orderRes.data);

      const tnaRes = await API.get(`/tnas/po/${id}`);
      setTnaTasks(tnaRes.data || []);
    } catch (error) {

  console.error(
    "Error pulling order workspace contexts:",
    error
  );

  if (
    error?.response?.status === 403
  ) {

    setUnauthorized(true);

    setError(
      "You are not authorized to access this purchase order."
    );

  } else if (
    error?.response?.status === 404
  ) {

    setError(
      "Purchase order not found."
    );

  } else {

    setError(
      "Failed to load purchase order."
    );
  }
}finally {
      setLoading(false);
    }
  };

  // Handler: Main Purchase Order overall status bar update
  const updatePOStatus = async (status) => {
    try {
      await API.patch(`/purchase-orders/${id}/status`, { status });
      setOrder((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error("Error updating main PO status registry:", error);
    }
  };

  // Handler: Inline TNA Status Dropdown modifier
  const handleUpdateTnaStatus = async (tnaId, updatedStatus) => {
    try {
      const coreTask = tnaTasks.find(t => t.id === tnaId);
      let calculatedActualDate = coreTask?.actual_date || null;
      
      if (updatedStatus === "COMPLETED" && !calculatedActualDate) {
        calculatedActualDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      }

      await API.patch(`/tnas/${tnaId}/status`, { status: updatedStatus });
      
      if (updatedStatus === "COMPLETED") {
        await API.patch(`/tnas/${tnaId}`, {
          priority: coreTask?.priority || "MEDIUM",
          planned_date: coreTask?.planned_date,
          actual_date: calculatedActualDate,
          remarks: coreTask?.remarks || ""
        });
      }

      await fetchOrderAndTna();
    } catch (error) {
      console.error("Failed to update TNA status context:", error);
    }
  };

  // Handler: Open task field modification layer
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      planned_date: task.planned_date || "",
      actual_date: task.actual_date || "",
      remarks: task.remarks || "",
      priority: task.priority || "MEDIUM"
    });
  };

  // Handler: Submit task modification updates to the DB
  const handleSaveTnaEdit = async (tnaId) => {
    try {
      await API.patch(`/tnas/${tnaId}`, {
        planned_date: editFormData.planned_date,
        actual_date: editFormData.actual_date || null,
        remarks: editFormData.remarks,
        priority: editFormData.priority
      });
      setEditingTaskId(null);
      await fetchOrderAndTna();
    } catch (error) {
      console.error("Failed to commit TNA updates:", error);
    }
  };

  // Handler: Fixed schema verification payload builder
  const handleAddNewTna = async (e) => {
    e.preventDefault();
    if (!newActivity.planned_date) {
      alert("Please specify a target delivery date before committing.");
      return;
    }
    
    try {
      await API.post(`/tnas/po/${id}`, {
        activity_type: newActivity.activity_type,
        priority: newActivity.priority,
        planned_date: newActivity.planned_date,
        remarks: newActivity.remarks || "Manually attached step"
      });
      setShowTnaModal(false);
      setNewActivity({ activity_type: "FABRIC_BOOKING", priority: "MEDIUM", planned_date: "", remarks: "" });
      await fetchOrderAndTna();
    } catch (error) {
      console.error("Could not write milestone option to database:", error);
    }
  };

  // Organized 5-Column Pipeline tracking structure mapping user-supplied enums
  const processColumns = [
    { 
      title: "Pre Production", 
      colorClass: "text-purple-400 border-purple-500/20 bg-purple-500/5", 
      key: "PRE_PROD", 
      types: [
        "FABRIC_BOOKING", "FABRIC_APPROVAL", "LAB_DIP_APPROVAL", 
        "TRIMS_APPROVAL", "FIT_SAMPLE", "PP_SAMPLE", 
        "SIZE_SET_SAMPLE", "CAD_MARKER", "PILOT_RUN"
      ] 
    },
    { 
      title: "Production", 
      colorClass: "text-orange-400 border-orange-500/20 bg-orange-500/5", 
      key: "PROD", 
      types: [
        "CUTTING_START", "STITCHING_START", "INLINE_INSPECTION", 
        "MIDLINE_INSPECTION", "FINISHING", "PACKING"
      ] 
    },
    { 
      title: "Quality Control", 
      colorClass: "text-amber-400 border-amber-500/20 bg-amber-500/5", 
      key: "QC", 
      types: ["FINAL_INSPECTION", "METAL_DETECTION", "QA_APPROVAL"] 
    },
    { 
      title: "Shipping & Delivery", 
      colorClass: "text-blue-400 border-blue-500/20 bg-blue-500/5", 
      key: "SHIPPING", 
      types: [
        "CARTON_READY", "SHIPMENT_BOOKING", "CONTAINER_LOADING", 
        "DISPATCH", "DELIVERY"
      ] 
    },
    { 
      title: "Payment Registry", 
      colorClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", 
      key: "PAYMENT", 
      types: ["ADVANCE_PAYMENT", "FINAL_PAYMENT"] 
    }
  ];

  if (!loading && error) {

  return (

    <DashboardLayout>

      <EmptyState

        unauthorized={
          unauthorized
        }

        title={
          unauthorized

          ? "Unauthorized Access"

          : "Order Not Found"
        }

        description={error}

      />

    </DashboardLayout>
  );
}

  return (
    <DashboardLayout>
      <div className="max-w-[1800px] mx-auto space-y-8 pb-16">
        
        {/* HEADER BACK NAVIGATION TRACK BAR */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/orders")}
            className="text-zinc-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            ← Back to Orders Registry
          </button>
          <div className="px-5 py-2 rounded-2xl bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/10">
            {order?.status?.replaceAll("_", " ")}
          </div>
        </div>

        {/* PO HEADER COMMERCIAL DETAILS OVERVIEW PANEL */}
        <div className="relative overflow-hidden rounded-[36px] border border-[#2A3142] bg-[#151821] p-8">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-zinc-500 uppercase tracking-[3px] text-xs font-semibold">System Document Context</p>
                <h1 className="text-5xl font-black text-white mt-2 tracking-tight">{order?.po_number}</h1>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Pill icon={<Shirt size={15} />} text={order?.rfq?.garment_type} />
                <Pill icon={<Truck size={15} />} text={order?.lead_time ? `${order.lead_time} Days Lead` : null} />
                <Pill icon={<CalendarDays size={15} />} text={order?.delivery_date} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
                  <span className="text-zinc-500 text-xs block mb-1">Brand Name</span>
                  <span className="text-white font-bold truncate text-sm block">{order?.rfq?.brand || "-"}</span>
                </div>
                <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
                  <span className="text-zinc-500 text-xs block mb-1">Fabric Sourcing</span>
                  <span className="text-white font-bold truncate text-sm block">{order?.rfq?.fabric_type || "-"}</span>
                </div>
                <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
                  <span className="text-zinc-500 text-xs block mb-1">Total Quantity</span>
                  <span className="text-white font-bold text-sm block">{order?.quantity || "0"} Pcs</span>
                </div>
                <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
                  <span className="text-zinc-500 text-xs block mb-1">Payment Condition</span>
                  <span className="text-white font-bold text-sm truncate block">{order?.payment_terms || "Standard Terms"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0F141D] border border-[#2A3142] p-6 space-y-6">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Accumulated Invoicing Frame</p>
                <h2 className="text-4xl font-black text-white mt-2">
                  {order?.currency} {formatMoney(order?.commercials?.total_amount)}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-[#151821] border border-[#2A3142] p-3 rounded-xl text-center">
                  <span className="text-zinc-500 text-[10px] uppercase block">Target</span>
                  <span className="text-zinc-200 font-bold text-xs">{order?.currency} {formatMoney(order?.commercials?.target_price)}</span>
                </div>
                <div className="bg-[#151821] border border-[#2A3142] p-3 rounded-xl text-center">
                  <span className="text-zinc-500 text-[10px] uppercase block">Supplier</span>
                  <span className="text-zinc-200 font-bold text-xs">{order?.currency} {formatMoney(order?.commercials?.supplier_price)}</span>
                </div>
                <div className="bg-[#151821] border border-[#2A3142] p-3 rounded-xl text-center">
                  <span className="text-zinc-500 text-[10px] uppercase block">Margin</span>
                  <span className="text-emerald-400 font-bold text-xs">{formatMoney(order?.commercials?.profitability)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSITION STATE ORDER BAR */}
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#151821] border border-[#2A3142] overflow-x-auto scrollbar-none">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider px-3 whitespace-nowrap">Transition Order State:</span>
          {["CREATED", "APPROVED", "IN_PRODUCTION", "SHIPPED", "DELIVERED"].map((status) => (
            <button
              key={status}
              onClick={() => updatePOStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border whitespace-nowrap ${
                order?.status === status
                  ? "bg-orange-500 text-white border-orange-600 shadow-md"
                  : "bg-[#0F141D] border-[#2A3142] text-zinc-400 hover:text-white hover:border-zinc-600"
              }`}
            >
              {status.replaceAll("_", " ")}
            </button>
          ))}
        </div>

        {/* 5-COLUMN RESPONSIVE KANBAN TNA PIPELINE LAYOUT GRID */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Time & Action (TNA) Pipeline</h2>
            <p className="text-xs text-zinc-500 mt-1">Monitor operational milestones, track delay parameters, and update process tracking cards.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {processColumns.map((col) => {
              const filteredTasks = tnaTasks.filter((task) =>
                col.types.includes(task.activity_type)
              );

              return (
                <div
                  key={col.key}
                  className="rounded-[24px] border border-[#2A3142] bg-[#151821] p-4 flex flex-col justify-between min-h-[580px]"
                >
                  <div className="space-y-4">
                    <div className={`px-3 py-1 rounded-xl border font-bold text-[11px] tracking-wider uppercase w-fit ${col.colorClass}`}>
                      {col.title}
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.length === 0 ? (
                        <div className="border border-dashed border-[#2A3142]/60 rounded-2xl p-6 text-center text-zinc-600 text-xs">
                          No tasks configured
                        </div>
                      ) : (
                        filteredTasks.map((task) => {
                          const daysMetrics = calculateDaysRemaining(task.planned_date, task.status);
                          const isEditing = editingTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              className="rounded-xl bg-[#0F141D] border border-[#2A3142] p-3 space-y-3 relative overflow-hidden group hover:border-[#3A435A] transition-all"
                            >
                              {/* HEADER ROW: Activity Title & Overdue Metrics */}
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-xs font-bold text-white leading-tight truncate max-w-[65%]" title={task.activity_type.replaceAll("_", " ")}>
                                  {task.activity_type.replaceAll("_", " ")}
                                </h4>
                                
                                {daysMetrics.isOverdue ? (
                                  <div className="flex items-center gap-1 text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                    <AlertTriangle size={10} />
                                    <span>{daysMetrics.text}</span>
                                  </div>
                                ) : task.status === "COMPLETED" ? (
                                  <div className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                    <CheckCircle2 size={10} />
                                    <span>Done</span>
                                  </div>
                                ) : (
                                  <div className="text-[10px] font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                                    {daysMetrics.text}
                                  </div>
                                )}
                              </div>

                              {/* HIGHLIGHTED TOP LEVEL: Assigned/Actual Date */}
                              {!isEditing && (
                                <div className="bg-[#151821] border border-[#2A3142]/60 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-zinc-500 text-[10px] font-medium flex items-center gap-1">
                                    <Clock size={10} className="text-zinc-400" /> Assigned:
                                  </span>
                                  {task.actual_date ? (
                                    <span className="font-mono text-[11px] font-bold text-emerald-400">
                                      {task.actual_date}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-zinc-500 italic">Pending</span>
                                  )}
                                </div>
                              )}

                              {/* CONDITIONAL RENDER: EDIT PANEL VS VIEW DETAIL TRACK */}
                              {isEditing ? (
                                <div className="space-y-2.5 pt-2 border-t border-[#2A3142]/40">
                                  <div>
                                    <label className="text-[9px] text-zinc-500 block mb-0.5 uppercase font-bold tracking-wider">Planned Target:</label>
                                    <input
                                      type="date"
                                      value={editFormData.planned_date}
                                      onChange={(e) => setEditFormData({ ...editFormData, planned_date: e.target.value })}
                                      className="w-full bg-[#151821] border border-[#2A3142] rounded-md p-1.5 text-xs text-white focus:border-orange-500 outline-none font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] text-zinc-500 block mb-0.5 uppercase font-bold tracking-wider">Assigned Date:</label>
                                    <input
                                      type="date"
                                      value={editFormData.actual_date}
                                      onChange={(e) => setEditFormData({ ...editFormData, actual_date: e.target.value })}
                                      className="w-full bg-[#151821] border border-[#2A3142] rounded-md p-1.5 text-xs text-white focus:border-orange-500 outline-none font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] text-zinc-500 block mb-0.5 uppercase font-bold tracking-wider">Remarks:</label>
                                    <input
                                      type="text"
                                      value={editFormData.remarks}
                                      onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                                      className="w-full bg-[#151821] border border-[#2A3142] rounded-md p-1.5 text-xs text-zinc-200 focus:border-orange-500 outline-none"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingTaskId(null)}
                                      className="p-1 rounded-md border border-[#2A3142] text-zinc-400 hover:text-white transition-all"
                                    >
                                      <X size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveTnaEdit(task.id)}
                                      className="p-1 rounded-md bg-orange-500 text-white transition-all hover:bg-orange-600"
                                    >
                                      <Check size={12} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* BOTTOM LEVEL DETAILS: Planned Target & Notes */}
                                  <div className="space-y-1 text-[11px] border-t border-[#2A3142]/40 pt-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-zinc-500 flex items-center gap-1">
                                        <Calendar size={10} /> Planned Target:
                                      </span>
                                      <span className={`font-mono font-semibold ${daysMetrics.isOverdue ? "text-red-400" : "text-zinc-300"}`}>
                                        {task.planned_date}
                                      </span>
                                    </div>

                                    {task.remarks && (
                                      <p className="text-[10px] text-zinc-400 italic truncate mt-1">
                                        Note: {task.remarks}
                                      </p>
                                    )}
                                  </div>

                                  {/* INTERACTIVE ACTIONS: Status updates and Edit */}
                                  <div className="pt-2 flex items-center justify-between gap-1 border-t border-[#2A3142]/20 mt-1">
                                    <select
                                      value={task.status}
                                      onChange={(e) => handleUpdateTnaStatus(task.id, e.target.value)}
                                      className="bg-[#151821] border border-[#2A3142] rounded-md text-zinc-300 text-[10px] px-1.5 py-1 outline-none focus:border-orange-500 cursor-pointer font-medium max-w-[65%]"
                                    >
                                      <option value="PENDING">Pending</option>
                                      <option value="IN_PROGRESS">In Progress</option>
                                      <option value="COMPLETED">Completed</option>
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() => startEditing(task)}
                                      className="p-1 rounded-md bg-[#151821] border border-[#2A3142] text-zinc-400 hover:text-orange-400 transition-all flex items-center gap-0.5 text-[10px] font-medium"
                                    >
                                      <Edit2 size={10} />
                                      <span>Edit</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTargetColumn(col.key);
                      const fallbackType = col.types[0];
                      setNewActivity({
                        activity_type: fallbackType,
                        priority: "MEDIUM",
                        planned_date: "",
                        remarks: ""
                      });
                      setShowTnaModal(true);
                    }}
                    className="mt-4 w-full py-2 rounded-xl border border-dashed border-[#2A3142] text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-xs flex items-center justify-center gap-1 font-medium bg-[#0F141D]/30"
                  >
                    <Plus size={12} /> Add Milestone
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* POPUP MODAL ARCHITECTURE FOR ADDING CLASSIFIED TASK ASSIGNMENTS */}
        {showTnaModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] w-full max-w-md p-6 space-y-4 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150">
              <div>
                <h3 className="text-lg font-black tracking-tight">Deploy New Pipeline Method</h3>
                <p className="text-xs text-zinc-400 mt-1">Configure operational parameters to append to selected pipeline category.</p>
              </div>

              <form onSubmit={handleAddNewTna} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Task Activity Identifier</label>
                  <select
                    value={newActivity.activity_type}
                    onChange={(e) => setNewActivity((p) => ({ ...p, activity_type: e.target.value }))}
                    className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-xs text-zinc-200 outline-none focus:border-orange-500 font-semibold cursor-pointer"
                  >
                    {targetColumn === "PRE_PROD" && (
                      <>
                        <option value="FABRIC_BOOKING">Fabric Booking</option>
                        <option value="FABRIC_APPROVAL">Fabric Approval</option>
                        <option value="LAB_DIP_APPROVAL">Lab Dip Approval</option>
                        <option value="TRIMS_APPROVAL">Trims Approval</option>
                        <option value="FIT_SAMPLE">Fit Sample</option>
                        <option value="PP_SAMPLE">Pre-Production Sample</option>
                        <option value="SIZE_SET_SAMPLE">Size Set Sample</option>
                        <option value="CAD_MARKER">CAD Marker</option>
                        <option value="PILOT_RUN">Pilot Run</option>
                      </>
                    )}
                    {targetColumn === "PROD" && (
                      <>
                        <option value="CUTTING_START">Cutting Start</option>
                        <option value="STITCHING_START">Stitching Start</option>
                        <option value="INLINE_INSPECTION">Inline Inspection</option>
                        <option value="MIDLINE_INSPECTION">Midline Inspection</option>
                        <option value="FINISHING">Finishing</option>
                        <option value="PACKING">Packing</option>
                      </>
                    )}
                    {targetColumn === "QC" && (
                      <>
                        <option value="FINAL_INSPECTION">Final Inspection</option>
                        <option value="METAL_DETECTION">Metal Detection</option>
                        <option value="QA_APPROVAL">QA Approval</option>
                      </>
                    )}
                    {targetColumn === "SHIPPING" && (
                      <>
                        <option value="CARTON_READY">Carton Ready</option>
                        <option value="SHIPMENT_BOOKING">Shipment Booking</option>
                        <option value="CONTAINER_LOADING">Container Loading</option>
                        <option value="DISPATCH">Dispatch</option>
                        <option value="DELIVERY">Delivery</option>
                      </>
                    )}
                    {targetColumn === "PAYMENT" && (
                      <>
                        <option value="ADVANCE_PAYMENT">Advance Deposit Payment</option>
                        <option value="FINAL_PAYMENT">Final Settlement Balance</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Delivery Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newActivity.planned_date}
                    onChange={(e) => setNewActivity((p) => ({ ...p, planned_date: e.target.value }))}
                    className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-xs text-zinc-200 outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Operational Note / Remarks</label>
                  <input
                    type="text"
                    placeholder="E.g., Production assembly comments..."
                    value={newActivity.remarks}
                    onChange={(e) => setNewActivity((p) => ({ ...p, remarks: e.target.value }))}
                    className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-xs text-zinc-200 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTnaModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold border border-[#2A3142] rounded-xl text-zinc-400 hover:text-white transition-all"
                  >
                    Dismiss
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-black bg-orange-500 rounded-xl text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
                  >
                    Commit Task Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

function Pill({ icon, text }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F141D] border border-[#2A3142] text-xs text-zinc-300 font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default OrderDetailPage;