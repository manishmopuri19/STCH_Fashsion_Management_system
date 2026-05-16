import { useNavigate } from "react-router-dom";

function SupplierTable({
  suppliers,
  loading
}) {

  const navigate = useNavigate();

  if (loading) {

    return (
      <div className="
        text-white
      ">
        Loading...
      </div>
    );
  }

  return (

    <div className="
      overflow-hidden
      rounded-3xl
      border
      border-[#2A3142]
    ">

      <table className="
        w-full
      ">

        <thead className="
          bg-[#151821]
        ">

          <tr>

            <Th>Company</Th>

            <Th>Contact</Th>

            <Th>Country</Th>

            <Th>Specialization</Th>

            <Th>MOQ</Th>

          </tr>

        </thead>

        <tbody>

          {suppliers.map((supplier) => (

            <tr

              key={supplier.id}

              onClick={() =>
                navigate(
                  `/suppliers/${supplier.id}`
                )
              }

              className="
                border-t
                border-[#2A3142]
                bg-[#0F141D]
                hover:bg-[#151821]
                cursor-pointer
                transition-all
              "
            >

              <Td>
                {supplier.company_name}
              </Td>

              <Td>
                {supplier.contact_person}
              </Td>

              <Td>
                {supplier.country}
              </Td>

              <Td>
                {supplier.specialization}
              </Td>

              <Td>
                {
                  supplier.minimum_order_quantity
                }
              </Td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

function Th({ children }) {

  return (
    <th className="
      text-left
      px-6
      py-4
      text-zinc-500
      font-medium
    ">
      {children}
    </th>
  );
}

function Td({ children }) {

  return (
    <td className="
      px-6
      py-5
      text-white
    ">
      {children}
    </td>
  );
}

export default SupplierTable;