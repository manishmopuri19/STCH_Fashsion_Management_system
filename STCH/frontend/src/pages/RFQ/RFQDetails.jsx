import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Package,
  Factory,
  ClipboardCheck,
  DollarSign,
  FileText,
  CheckCircle2,
  Users,
  Plus,
  Clock3,
  CircleDashed,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../../api/axios";

import { useAuth } from "../../context/AuthContext";

import RFQWorkflowDrawer from "../../components/rfq/RFQWorkflowDrawer";


const statusColors = {

  NEW:
    "bg-blue-500/20 text-blue-400 border-blue-500/30",

  QUOTED:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",

  NEGOTIATION:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",

  APPROVED:
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",

  PO_CREATED:
    "bg-violet-500/20 text-violet-400 border-violet-500/30",

  CANCELLED:
    "bg-red-500/20 text-red-400 border-red-500/30",
};


const statusOptions = [

  "NEW",

  "QUOTED",

  "NEGOTIATION",

  "APPROVED",

  "PO_CREATED",

  "CANCELLED",
];


function RFQDetailPage() {

  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useAuth();

  const [rfq, setRfq] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("");

const [workflowOpen,
setWorkflowOpen] =
useState(false);

  useEffect(() => {

    if(id){

      fetchRFQ();
    }

  }, [id]);


  const fetchRFQ = async () => {

    try {

      const response =
        await API.get(
          `/rfqs/${id}`
        );

      setRfq(response.data);

      setStatus(
        response.data.status
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  const updateStatus =
    async () => {

    try {

      await API.patch(

        `/rfqs/${id}/status`,

        {
          status
        }
      );

      fetchRFQ();

      alert(
        "Status updated"
      );

    } catch (error) {

      console.log(error);
    }
  };


  if(loading){

    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        flex
        items-center
        justify-center
        text-white
      ">

        Loading RFQ...

      </div>
    );
  }


  return (

    <div className="
      min-h-screen
      bg-[#0B0F19]
      text-white
      p-6
    ">

      {/* DRAWER */}
     <RFQWorkflowDrawer

  open={workflowOpen}

  onClose={() =>
    setWorkflowOpen(false)
  }

  rfq={rfq}

  onSuccess={fetchRFQ}
/>
       

      <div className="
        max-w-[1700px]
        mx-auto
        flex
        gap-6
      ">

        {/* LEFT */}
        <div className="
          flex-1
          space-y-6
        ">

          {/* HEADER */}
          <div className="
            bg-[#151821]
            border
            border-[#2A3142]
            rounded-3xl
            p-7
          ">

            <button

              onClick={() =>
                navigate(-1)
              }

              className="
                flex
                items-center
                gap-2
                text-zinc-500
                hover:text-white
                mb-6
              "
            >

              <ArrowLeft size={18} />

              Back

            </button>


            <div className="
              flex
              items-start
              justify-between
              gap-5
            ">

              <div>

                <h1 className="
                  text-4xl
                  font-bold
                ">
                  {rfq.rfq_number}
                </h1>

                <p className="
                  text-zinc-500
                  mt-2
                ">

                  {rfq.brand}

                  {" • "}

                  {rfq.garment_type}

                </p>

              </div>


              <div className={`
                px-5
                py-2
                rounded-2xl
                border
                text-sm
                font-medium
                ${statusColors[rfq.status]}
              `}>

                {rfq.status}

              </div>

            </div>

          </div>


          {/* BRAND */}
          <Section
            title="Brand Information"
            icon={<Factory size={18} />}
          >

            <Grid>

              <Field
                label="Brand"
                value={rfq.brand}
              />

              <Field
                label="Season"
                value={rfq.season}
              />

              <Field
                label="Department"
                value={rfq.department}
              />

              <Field
                label="Category"
                value={rfq.category}
              />

              <Field
                label="Sub Category"
                value={rfq.sub_category}
              />

              <Field
                label="Priority"
                value={rfq.priority}
              />

            </Grid>

          </Section>


          {/* GARMENT */}
          <Section
            title="Garment Details"
            icon={<Package size={18} />}
          >

            <Grid>

              <Field
                label="Garment Type"
                value={rfq.garment_type}
              />

              <Field
                label="Fabric Type"
                value={rfq.fabric_type}
              />

              <Field
                label="Fabric Weight"
                value={rfq.fabric_weight}
              />

              <Field
                label="Fabric Composition"
                value={
                  rfq.fabric_composition
                }
              />

              <Field
                label="Construction"
                value={rfq.construction}
              />

              <Field
                label="Yarn Count"
                value={rfq.yarn_count}
              />

            </Grid>

          </Section>


          {/* ORDER */}
          <Section
            title="Order Details"
            icon={<DollarSign size={18} />}
          >

            <Grid>

              <Field
                label="Quantity"
                value={rfq.quantity}
              />

              <Field
                label="Target Price"
                value={`${rfq.currency} ${rfq.target_price}`}
              />

              <Field
                label="Delivery Date"
                value={rfq.delivery_date}
              />

              <Field
                label="Incoterms"
                value={rfq.incoterms}
              />

            </Grid>

          </Section>


          {/* TRIMS */}
          <Section
            title="Trims & Accessories"
            icon={<ClipboardCheck size={18} />}
          >

            <Grid>

              <Field
                label="Trims Details"
                value={rfq.trims_details}
              />

              <Field
                label="Packaging Type"
                value={rfq.packaging_type}
              />

              <Field
                label="Label Type"
                value={rfq.label_type}
              />

            </Grid>

          </Section>


          {/* WASH */}
          <Section
            title="Wash & Finish"
            icon={<CheckCircle2 size={18} />}
          >

            <Grid>

              <Field
                label="Garment Wash"
                value={
                  rfq.garment_wash?.join(", ")
                }
              />

              <Field
                label="Dye Type"
                value={rfq.dye_type}
              />

              <Field
                label="Print Type"
                value={rfq.print_type}
              />

              <Field
                label="Embroidery Type"
                value={rfq.embroidery_type}
              />

              <Field
                label="Special Finish"
                value={rfq.special_finish}
              />

            </Grid>

          </Section>


          {/* COMPLIANCE */}
          <Section
            title="Compliance & Testing"
            icon={<ClipboardCheck size={18} />}
          >

            <Grid>

              <Field
                label="Compliance Standards"
                value={
                  rfq.compliance_standards
                  ?.join(", ")
                }
              />

              <Field
                label="Testing Required"
                value={
                  rfq.testing_required
                  ?.join(", ")
                }
              />

              <Field
                label="Social Compliance"
                value={rfq.social_compliance}
              />

              <Field
                label="Quality Standards"
                value={rfq.quality_standards}
              />

            </Grid>

          </Section>


          {/* FILES */}
          <Section
            title="Files & References"
            icon={<FileText size={18} />}
          >

            <Grid>

              <Field
                label="Tech Pack"
                value={rfq.tech_pack_url}
              />

              <Field
                label="Reference Images"
                value={rfq.reference_images}
              />

            </Grid>

          </Section>


          {/* NOTES */}
          <Section
            title="Additional Notes"
            icon={<FileText size={18} />}
          >

            <div className="
              bg-[#0F141D]
              border
              border-[#2A3142]
              rounded-2xl
              p-5
              text-zinc-300
              leading-relaxed
            ">

              {rfq.notes ||
                "No notes added"}

            </div>

          </Section>

        </div>


        {/* RIGHT PANEL */}
        <div className="
          w-[390px]
          sticky
          top-6
          h-fit
          space-y-6
        ">

          {/* ACTION CENTER */}
          <div className="
            bg-[#151821]
            border
            border-[#2A3142]
            rounded-3xl
            p-6
            space-y-6
          ">

            <h2 className="
              text-xl
              font-semibold
            ">
              Action Center
            </h2>


            {/* STATUS */}
            {(user?.role === "ADMIN" ||
              user?.role === "MERCHANDISER") && (

              <div>

                <label className="
                  block
                  text-sm
                  text-zinc-400
                  mb-3
                ">
                  Update Status
                </label>

                <select

                  value={status}

                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }

                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#0F141D]
                    border
                    border-[#2A3142]
                    text-white
                    outline-none
                  "
                >

                  {statusOptions.map(
                    (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

                <button

                  onClick={updateStatus}

                  className="
                    mt-4
                    w-full
                    py-3
                    rounded-2xl
                    bg-orange-500
                    hover:bg-orange-400
                    transition-all
                    font-medium
                  "
                >
                  Save Status
                </button>

              </div>
            )}


            {/* CONVERT PO */}
            {(user?.role === "ADMIN" ||
              user?.role === "MERCHANDISER") && (

              <div className="
                border-t
                border-[#2A3142]
                pt-6
              ">

                <button

                  onClick={() =>
  setWorkflowOpen(true)
}

                  className="
                    w-full
                    py-4
                    rounded-2xl
                    bg-violet-500
                    hover:bg-violet-400
                    transition-all
                    font-semibold
                  "
                >

                  Convert to Purchase Order

                </button>

              </div>
            )}

          </div>


          {/* COLLABORATORS */}
          <div className="
            bg-[#151821]
            border
            border-[#2A3142]
            rounded-3xl
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-5
            ">

              <h2 className="
                text-lg
                font-semibold
              ">
                Collaborators
              </h2>

              <button className="
                w-10
                h-10
                rounded-xl
                bg-[#1E2533]
                flex
                items-center
                justify-center
              ">

                <Plus size={18} />

              </button>

            </div>


            <div className="
              space-y-4
            ">

              <Collaborator
                name="John Doe"
                role="MERCHANDISER"
              />

              <Collaborator
                name="Alex"
                role="QC"
              />

            </div>

          </div>


          {/* ACTIVITY */}
          <div className="
            bg-[#151821]
            border
            border-[#2A3142]
            rounded-3xl
            p-6
          ">

            <h2 className="
              text-lg
              font-semibold
              mb-5
            ">
              Activity Timeline
            </h2>


            <div className="
              space-y-5
            ">

              <TimelineItem
                icon={<CircleDashed size={16} />}
                title="RFQ Created"
                time="2 hours ago"
              />

              <TimelineItem
                icon={<Clock3 size={16} />}
                title="Supplier quotation received"
                time="1 hour ago"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


function Section({
  title,
  icon,
  children
}) {

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-3xl
      p-6
    ">

      <div className="
        flex
        items-center
        gap-3
        mb-6
      ">

        <div className="
          w-10
          h-10
          rounded-xl
          bg-[#1E2533]
          flex
          items-center
          justify-center
        ">
          {icon}
        </div>

        <h2 className="
          text-xl
          font-semibold
        ">
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
}


function Grid({
  children
}) {

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      gap-5
    ">

      {children}

    </div>
  );
}


function Field({
  label,
  value
}) {

  return (

    <div className="
      bg-[#0F141D]
      border
      border-[#2A3142]
      rounded-2xl
      p-5
    ">

      <p className="
        text-sm
        text-zinc-500
        mb-2
      ">
        {label}
      </p>

      <p className="
        text-white
        font-medium
        break-words
      ">

        {value || "-"}

      </p>

    </div>
  );
}


function Collaborator({
  name,
  role
}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      bg-[#0F141D]
      border
      border-[#2A3142]
      rounded-2xl
      p-4
    ">

      <div className="
        flex
        items-center
        gap-3
      ">

        <div className="
          w-11
          h-11
          rounded-full
          bg-orange-500
          flex
          items-center
          justify-center
          font-semibold
        ">

          {name.charAt(0)}

        </div>

        <div>

          <p className="
            font-medium
          ">
            {name}
          </p>

          <p className="
            text-sm
            text-zinc-500
          ">
            {role}
          </p>

        </div>

      </div>

    </div>
  );
}


function TimelineItem({
  icon,
  title,
  time
}) {

  return (

    <div className="
      flex
      gap-4
    ">

      <div className="
        w-10
        h-10
        rounded-xl
        bg-[#1E2533]
        flex
        items-center
        justify-center
      ">

        {icon}

      </div>

      <div>

        <p className="
          text-sm
          font-medium
        ">
          {title}
        </p>

        <p className="
          text-xs
          text-zinc-500
          mt-1
        ">
          {time}
        </p>

      </div>

    </div>
  );
}


export default RFQDetailPage;