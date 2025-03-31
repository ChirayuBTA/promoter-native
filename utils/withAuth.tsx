"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.FC) => {
  return function AuthComponent(props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/"); // Use `replace` to avoid going back to protected page
      } else {
        setIsAuthenticated(true); // Allow rendering only if authenticated
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; // Prevent UI from flashing before redirect
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
