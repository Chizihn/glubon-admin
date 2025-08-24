import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/authStore";
import { LOGIN } from "../../graphql/mutations/auth";
import type { AuthResponse } from "../../types/auth";
import { formatGraphQLError } from "../../util/formatGraphQlError";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: storeLogin, logout } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const authData: AuthResponse = data.login;

      // Check admin role
      if (authData.user.role !== "ADMIN") {
        toast.error("You do not have permission to access this area.");
        logout();
        return;
      }

      // Store auth data
      storeLogin(
        {
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
        },
        authData.user
      );

      toast.success("Welcome back to Glubon Admin!");
      navigate(from, { replace: true });
    },

    onError: (error) => {
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "Login failed. Please try again.");
      // setEmail("");
      // setPassword("");
      console.error("Login error:", errMsg);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await loginMutation({
        variables: { email, password },
      });
    } catch (error) {
      // Error handled by onError callback
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "Login failed. Please try again.");
      console.error("Login submission error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Glubon Admin</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@glubon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              size={"lg"}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
