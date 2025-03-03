import { useEffect, useState } from "react";
import SupplierDetailPage from "./SupplierDetails/SupplierPage";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../../api/supabaseClient";
import { Supplier } from "../../types/supplier";
import CreatePage from "../Supplier/CreateSupplier/CreatePage";

function SupplierInformation() {
  const user = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data: supplierData, error: supplierError } = await supabase
          .from("supplier")
          .select("*")
          .eq("company_id", user.id)
          .single();

        if (supplierError) {
          console.error("Error fetching supplier:", supplierError);
          // Check for the specific error indicating no rows found
          if (supplierError.code === "PGRST116" && supplierError.details === "The result contains 0 rows") {
            setSupplier(null); // Explicitly set supplier to null when no rows are found.
            setError(null); // clear the error so it does not display.
          } else {
            setError("Error fetching supplier.");
          }
        } else if (supplierData) {
          setSupplier(supplierData);
          setError(null); // clear the error if there is data.
        } else {
          setSupplier(null); // Explicitly set supplier to null when no rows are found, even without a specific error code.
          setError(null); // clear the error so it does not display.
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return supplier ? <SupplierDetailPage  /> : <CreatePage />;
}

export default SupplierInformation;