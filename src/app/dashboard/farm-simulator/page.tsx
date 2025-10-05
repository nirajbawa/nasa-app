"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import FarmSimulator from "@/components/FarmSimulator";
import { useAuth } from "@/hooks/useAuth";

export default function FarmPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  0;

  const id = searchParams.get("id");
  const [farmData, setFarmData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchFarmData = async () => {
    if (!id || !user) return;

    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const areasRef = collection(db, 'areas');
      const q = query(areasRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      // Find farm by custom ID field
      const farmDoc = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.id === id; // Match the custom 'id' field
      });

      console.log(farmDoc.id)
      
      if (farmDoc) {
        console.log({ id: farmDoc.id, ...farmDoc.data() })
        setFarmData({ id: farmDoc.id, ...farmDoc.data() });
      } else {
        console.log('Farm not found in user farms');
      }
    } catch (error) {
      console.error('Error fetching farm data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchFarmData();
}, [id, user]);
  if (loading)
    return <div className="p-8 text-center">Loading farm data...</div>;
  if (!farmData) return <div className="p-8 text-center">Farm not found</div>;

  return <FarmSimulator farmData={farmData} />;
}
