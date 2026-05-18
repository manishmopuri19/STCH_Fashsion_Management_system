// components/orders/details/OrderTNASection.jsx

import { useMemo, useState } from "react";

import API from "../../../api/axios";


const workflowStages = {

  PRE_PRODUCTION: [

    "FABRIC_BOOKING",

    "LAB_DIP_APPROVAL",

    "TRIMS_APPROVAL",

    "FABRIC_PROCUREMENT"
  ],

  PRODUCTION: [

    "CUTTING",

    "STITCHING",

    "WASHING",

    "PRINTING",

    "PACKING"
  ],

  DELIVERY: [

    "SHIPMENT",

    "DELIVERY"
  ],

  PAYMENT: [

    "FINAL_PAYMENT"
  ]
};


const stageColors = {

  PRE_PRODUCTION:
    "from-violet-500 to-indigo-500",

  PRODUCTION:
    "from-orange-500 to-amber-500",

  DELIVERY:
    "from-cyan-500 to-blue-500",

  PAYMENT:
    "from-emerald-500 to-green-500"
};


const statuses = [

  "PENDING",

  "IN_PROGRESS",

  "COMPLETED",

  "DELAYED"
];


function OrderTNASection({

  tnas,

  poId,

  refresh

}) {

  const [showForm,
    setShowForm] =
    useState(false);

  const [formData, setFormData] =
    useState({

      activity_type:
        "FABRIC_BOOKING",

      planned_date: "",

      priority:
        "MEDIUM",

      remarks: ""
    });


  const groupedTNAs =
    useMemo(() => {

    const grouped = {};

    Object.keys(
      workflowStages
    ).forEach((stage) => {

      grouped[stage] =
        tnas.filter((tna) =>

          workflowStages[
            stage
          ].includes(
            tna.activity_type
          )
        );
    });

    return grouped;

  }, [tnas]);


  const createTNA =
    async () => {

    try {

      await API.post(

        `/tnas/po/${poId}`,

        formData
      );

      refresh();

      setShowForm(false);

    } catch (error) {

      console.log(error);
    }
  };


  const updateStatus =
    async (id, status) => {

    try {

      await API.patch(

        `/tnas/${id}/status`,

        { status }
      );

      refresh();

    } catch (error) {

      console.log(error);
    }
  };


  return (

    <div className="
      space-y-8
    ">

      {/* TOP */}
      <div className="
        flex
        items-center
        justify-between
      ">

        <div>

          <h2 className="
            text-4xl
            font-bold
            text-white
          ">

            Production Workflow

          </h2>

          <p className="
            text-zinc-500
            mt-2
          ">

            Operational execution &
            manufacturing tracking

          </p>

        </div>

        <button

          onClick={() =>
            setShowForm(!showForm)
          }

          className="
            px-6
            py-4
            rounded-2xl
            bg-orange-500
            hover:bg-orange-400
            text-white
            font-semibold
            transition-all
          "
        >

          + Add Activity

        </button>

      </div>


      {/* CREATE */}
      {showForm && (

        <div className="
          bg-[#151821]
          border
          border-[#2A3142]
          rounded-[32px]
          p-8
        ">

          <div className="
            grid
            grid-cols-2
            gap-6
          ">

            {/* ACTIVITY */}
            <Field
              label="Activity Type"
            >

              <select

                value={
                  formData.activity_type
                }

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    activity_type:
                      e.target.value
                  })
                }

                className="
                  field
                "
              >

                {Object.values(
                  workflowStages
                )
                  .flat()
                  .map((activity) => (

                  <option
                    key={activity}
                    value={activity}
                  >

                    {activity.replaceAll(
                      "_",
                      " "
                    )}

                  </option>

                ))}

              </select>

            </Field>


            {/* DATE */}
            <Field
              label="Planned Date"
            >

              <input

                type="date"

                value={
                  formData.planned_date
                }

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    planned_date:
                      e.target.value
                  })
                }

                className="
                  field
                "
              />

            </Field>


            {/* PRIORITY */}
            <Field
              label="Priority"
            >

              <select

                value={
                  formData.priority
                }

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    priority:
                      e.target.value
                  })
                }

                className="
                  field
                "
              >

                <option>
                  LOW
                </option>

                <option>
                  MEDIUM
                </option>

                <option>
                  HIGH
                </option>

                <option>
                  CRITICAL
                </option>

              </select>

            </Field>


            {/* REMARKS */}
            <Field
              label="Remarks"
            >

              <input

                value={
                  formData.remarks
                }

                onChange={(e) =>
                  setFormData({

                    ...formData,

                    remarks:
                      e.target.value
                  })
                }

                className="
                  field
                "
              />

            </Field>

          </div>


          <button

            onClick={createTNA}

            className="
              mt-8
              px-6
              py-4
              rounded-2xl
              bg-orange-500
              text-white
              font-semibold
            "
          >

            Create Activity

          </button>

        </div>

      )}


      {/* WORKFLOW */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-4
        gap-6
      ">

        {Object.keys(
          workflowStages
        ).map((stage) => (

          <WorkflowColumn

            key={stage}

            title={stage}

            color={
              stageColors[stage]
            }

            activities={
              groupedTNAs[stage]
            }

            updateStatus={
              updateStatus
            }

          />

        ))}

      </div>

    </div>
  );
}


/* COLUMN */
function WorkflowColumn({

  title,

  color,

  activities,

  updateStatus

}) {

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-[32px]
      p-5
      min-h-[650px]
    ">

      {/* TITLE */}
      <div className={`
        bg-gradient-to-r
        ${color}
        rounded-2xl
        px-5
        py-4
      `}>

        <h2 className="
          text-white
          font-bold
          text-lg
        ">

          {title.replaceAll(
            "_",
            " "
          )}

        </h2>

      </div>


      {/* ACTIVITIES */}
      <div className="
        mt-5
        space-y-4
      ">

        {activities.map((tna) => (

          <ActivityCard

            key={tna.id}

            tna={tna}

            updateStatus={
              updateStatus
            }

          />

        ))}

      </div>

    </div>
  );
}


/* CARD */
function ActivityCard({

  tna,

  updateStatus

}) {

  return (

    <div className="
      bg-[#0F141D]
      border
      border-[#2A3142]
      rounded-2xl
      p-5
      hover:border-orange-500/30
      transition-all
    ">

      <div className="
        flex
        items-start
        justify-between
      ">

        <h3 className="
          text-white
          font-semibold
          leading-snug
        ">

          {tna.activity_type
            ?.replaceAll(
              "_",
              " "
            )}

        </h3>

        <PriorityBadge
          priority={tna.priority}
        />

      </div>


      <div className="
        mt-4
        space-y-3
      ">

        <Info
          label="Planned"
          value={
            tna.planned_date
          }
        />

        <Info
          label="Remarks"
          value={
            tna.remarks || "-"
          }
        />

      </div>


      {/* STATUS */}
      <div className="
        mt-5
      ">

        <select

          value={tna.status}

          onChange={(e) =>
            updateStatus(
              tna.id,
              e.target.value
            )
          }

          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-[#151821]
            border
            border-[#2A3142]
            text-white
          "
        >

          {statuses.map((status) => (

            <option
              key={status}
              value={status}
            >

              {status.replaceAll(
                "_",
                " "
              )}

            </option>

          ))}

        </select>

      </div>

    </div>
  );
}


/* FIELD */
function Field({
  label,
  children
}) {

  return (

    <div>

      <p className="
        text-zinc-500
        mb-3
      ">

        {label}

      </p>

      {children}

    </div>
  );
}


/* INFO */
function Info({
  label,
  value
}) {

  return (

    <div>

      <p className="
        text-xs
        text-zinc-500
      ">

        {label}

      </p>

      <p className="
        text-white
        mt-1
      ">

        {value}

      </p>

    </div>
  );
}


/* PRIORITY */
function PriorityBadge({
  priority
}) {

  const colors = {

    LOW:
      "bg-zinc-700",

    MEDIUM:
      "bg-blue-500",

    HIGH:
      "bg-orange-500",

    CRITICAL:
      "bg-red-500"
  };

  return (

    <div className={`
      px-3
      py-1
      rounded-full
      text-xs
      text-white
      ${colors[priority]}
    `}>

      {priority}

    </div>
  );
}


export default OrderTNASection;