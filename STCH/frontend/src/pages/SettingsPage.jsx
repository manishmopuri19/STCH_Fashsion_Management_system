import { useEffect, useState } from "react";

import {
  Save,
  Loader2,
} from "lucide-react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";


function SettingsPage() {

  const { user, login } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({

      // USER TABLE
      userName: "",
      email: "",

      // SUPPLIER TABLE
      companyName: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      specialization: "",
      monthlyCapacity: "",
      moq: "",
      leadTime: "",
      website: "",
      gstNumber: "",
    });


  useEffect(() => {

    if(user){

      fetchProfile();
    }

  }, [user]);


  const fetchProfile = async () => {

    try {

      // FETCH USER DATA
      const userResponse =
        await API.get(
          `/users/${user.id}`
        );

      const userData =
        userResponse.data;

      // DEFAULT DATA
      let mergedData = {

        userName:
          userData.userName || "",

        email:
          userData.email || "",
      };


      // IF SUPPLIER FETCH
      if(
        user.role === "SUPPLIER"
        &&
        user.supplier_id
      ){

        const supplierResponse =
          await API.get(

            `/suppliers/${user.supplier_id}`
          );

        const supplierData =
          supplierResponse.data;

        mergedData = {

          ...mergedData,

          companyName:
            supplierData.company_name || "",

          phone:
            supplierData.phone || "",

          country:
            supplierData.country || "",

          city:
            supplierData.city || "",

          address:
            supplierData.address || "",

          specialization:
            supplierData.specialization || "",

          monthlyCapacity:
            supplierData.monthly_capacity || "",

          moq:
            supplierData.moq || "",

          leadTime:
            supplierData.lead_time || "",

          website:
            supplierData.website || "",

          gstNumber:
            supplierData.gst_number || "",
        };
      }

      setFormData(mergedData);

    } catch (error) {

      console.log(error);

    } finally {

      setPageLoading(false);
    }
  };


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,
    });
  };


  const handleSave = async () => {

    try {

      setLoading(true);

      // UPDATE USER TABLE
      const userPayload = {

        userName:
          formData.userName,

        email:
          formData.email,
      };

      await API.patch(

        `/users/${user.id}`,

        userPayload
      );


      // UPDATE SUPPLIER TABLE
      if(
        user.role === "SUPPLIER"
        &&
        user.supplier_id
      ){

        const supplierPayload = {

          company_name:
            formData.companyName,

          phone:
            formData.phone,

          country:
            formData.country,

          city:
            formData.city,

          address:
            formData.address,

          specialization:
            formData.specialization,

          monthly_capacity:
            formData.monthlyCapacity,

          moq:
            formData.moq,

          lead_time:
            formData.leadTime,

          website:
            formData.website,

          gst_number:
            formData.gstNumber,
        };

        await API.patch(

          `/suppliers/${user.supplier_id}`,

          supplierPayload
        );
      }


      // UPDATE LOCAL STORAGE
      const updatedUser = {

        ...user,

        userName:
          formData.userName,

        email:
          formData.email,
      };

      login(updatedUser);

      alert(
        "Settings updated successfully"
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  if(pageLoading){

    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        flex
        items-center
        justify-center
      ">

        <Loader2
          className="
            animate-spin
            text-orange-500
          "
          size={40}
        />

      </div>
    );
  }


  return (

    <div className="
      min-h-screen
      bg-[#0B0F19]
      p-8
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="
            text-4xl
            font-bold
            text-white
          ">
            Settings
          </h1>

          <p className="
            text-zinc-500
            mt-2
          ">
            Manage your account
            and workspace settings
          </p>

        </div>


        {/* CARD */}
        <div className="
          bg-[#151821]
          border
          border-[#2A3142]
          rounded-3xl
          p-8
          space-y-8
        ">

          {/* USER INFO */}
          <Section title="Basic Information">

            <Grid>

              <Input
                label="Full Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

            </Grid>

          </Section>


          {/* SUPPLIER INFO */}
          {user.role === "SUPPLIER" && (

            <Section title="Company Information">

              <Grid>

                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />

                <Input
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />

                <Input
                  label="Monthly Capacity"
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                />

                <Input
                  label="MOQ"
                  name="moq"
                  value={formData.moq}
                  onChange={handleChange}
                />

                <Input
                  label="Lead Time"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleChange}
                />

                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />

                <Input
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />

              </Grid>

            </Section>
          )}


          {/* SAVE */}
          <div className="pt-4">

            <button

              onClick={handleSave}

              className="
                px-6
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-orange-400
                text-white
                font-medium
                flex
                items-center
                gap-3
                hover:scale-[1.02]
                transition-all
              "
            >

              {loading ? (

                <Loader2
                  className="animate-spin"
                  size={18}
                />

              ) : (

                <Save size={18} />
              )}

              Save Changes

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


function Section({
  title,
  children
}) {

  return (

    <div>

      <h2 className="
        text-lg
        font-semibold
        text-white
        mb-6
      ">
        {title}
      </h2>

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


function Input({

  label,

  name,

  value,

  onChange

}) {

  return (

    <div>

      <label className="
        block
        mb-2
        text-sm
        text-zinc-400
      ">
        {label}
      </label>

      <input

        name={name}

        value={value}

        onChange={onChange}

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
          focus:border-orange-500
        "
      />

    </div>
  );
}

export default SettingsPage;