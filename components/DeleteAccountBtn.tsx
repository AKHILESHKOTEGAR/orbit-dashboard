"use client"

import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/app/actions";
import { useState } from "react";

export function DeleteAccountBtn() {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure? This will delete ALL your clients and invoices permanently.")) {
        setLoading(true);
        await deleteAccount();
    }
  };

  return (
    <Button 
        variant="destructive" 
        onClick={handleDelete} 
        disabled={loading}
    >
        {loading ? "Deleting..." : "Delete Account"}
    </Button>
  );
}
