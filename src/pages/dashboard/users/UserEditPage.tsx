// import { useState } from "react";
// import { useQuery, useMutation } from "@apollo/client";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { Textarea } from "../../../components/ui/textarea";
// import { Switch } from "../../../components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../../components/ui/avatar";
// import { ArrowLeft, Save, Upload } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";

// const editUserSchema = z.object({
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phoneNumber: z.string().optional(),
//   role: z.string(),
//   status: z.string(),
//   isVerified: z.boolean(),
//   isActive: z.boolean(),
//   city: z.string().optional(),
//   state: z.string().optional(),
//   country: z.string().optional(),
//   address: z.string().optional(),
//   bio: z.string().optional(),
// });

// type EditUserForm = z.infer<typeof editUserSchema>;

// export default function EditUserPage() {
//   const params = useParams();
//   const navigate = useNavigate();
//   const userId = params.id as string;

//   const { data, loading } = useQuery(GET_USER_DETAILS, {
//     variables: { userId },
//   });

//   const [updateUser] = useMutation(UPDATE_USER_STATUS);

//   const user = data?.getUserDetails;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//   } = useForm<EditUserForm>({
//     resolver: zodResolver(editUserSchema),
//     defaultValues: user
//       ? {
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           phoneNumber: user.phoneNumber || "",
//           role: user.role,
//           status: user.status,
//           isVerified: user.isVerified,
//           isActive: user.isActive,
//           city: user.city || "",
//           state: user.state || "",
//           country: user.country || "",
//           address: user.address || "",
//           bio: user.bio || "",
//         }
//       : undefined,
//   });

//   const onSubmit = async (data: EditUserForm) => {
//     try {
//       await updateUser({
//         variables: {
//           userId,
//           input: data,
//         },
//       });

//       toast({
//         title: "Success",
//         description: "User updated successfully",
//       });

//       router.push(`/dashboard/users/${userId}`);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="h-8 bg-gray-200 rounded animate-pulse" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <div className="h-96 bg-gray-200 rounded animate-pulse" />
//           </div>
//           <div className="h-64 bg-gray-200 rounded animate-pulse" />
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
//         <p className="text-gray-600 mt-2">
//           The user you're trying to edit doesn't exist.
//         </p>
//         <Button onClick={() => router.back()} className="mt-4">
//           Go Back
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button variant="outline" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
//             <p className="text-gray-600">
//               Update user information and settings
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Basic Information</CardTitle>
//                 <CardDescription>
//                   Update the user's basic profile information
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input
//                       id="firstName"
//                       {...register("firstName")}
//                       className={errors.firstName ? "border-red-500" : ""}
//                     />
//                     {errors.firstName && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.firstName.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input
//                       id="lastName"
//                       {...register("lastName")}
//                       className={errors.lastName ? "border-red-500" : ""}
//                     />
//                     {errors.lastName && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.lastName.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     {...register("email")}
//                     className={errors.email ? "border-red-500" : ""}
//                   />
//                   {errors.email && (
//                     <p className="text-sm text-red-600 mt-1">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="phoneNumber">Phone Number</Label>
//                   <Input
//                     id="phoneNumber"
//                     {...register("phoneNumber")}
//                     placeholder="+234 801 234 5678"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="bio">Bio</Label>
//                   <Textarea
//                     id="bio"
//                     {...register("bio")}
//                     placeholder="Tell us about this user..."
//                     rows={3}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Location Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Location Information</CardTitle>
//                 <CardDescription>
//                   User's location and address details
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="city">City</Label>
//                     <Input
//                       id="city"
//                       {...register("city")}
//                       placeholder="Lagos"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="state">State</Label>
//                     <Input
//                       id="state"
//                       {...register("state")}
//                       placeholder="Lagos State"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="country">Country</Label>
//                     <Input
//                       id="country"
//                       {...register("country")}
//                       placeholder="Nigeria"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="address">Full Address</Label>
//                   <Textarea
//                     id="address"
//                     {...register("address")}
//                     placeholder="Complete address..."
//                     rows={2}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Account Settings */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Account Settings</CardTitle>
//                 <CardDescription>
//                   Manage user account status and permissions
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="role">Role</Label>
//                     <Select
//                       onValueChange={(value) => setValue("role", value)}
//                       defaultValue={user.role}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select role" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="TENANT">Tenant</SelectItem>
//                         <SelectItem value="PROPERTY_OWNER">
//                           Property Owner
//                         </SelectItem>
//                         <SelectItem value="ADMIN">Admin</SelectItem>
//                         <SelectItem value="MODERATOR">Moderator</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label htmlFor="status">Status</Label>
//                     <Select
//                       onValueChange={(value) => setValue("status", value)}
//                       defaultValue={user.status}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ACTIVE">Active</SelectItem>
//                         <SelectItem value="INACTIVE">Inactive</SelectItem>
//                         <SelectItem value="SUSPENDED">Suspended</SelectItem>
//                         <SelectItem value="BANNED">Banned</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="isVerified">Verified User</Label>
//                       <p className="text-sm text-gray-600">
//                         Mark this user as verified
//                       </p>
//                     </div>
//                     <Switch
//                       id="isVerified"
//                       checked={watch("isVerified")}
//                       onCheckedChange={(checked) =>
//                         setValue("isVerified", checked)
//                       }
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="isActive">Active Account</Label>
//                       <p className="text-sm text-gray-600">
//                         Enable or disable user account
//                       </p>
//                     </div>
//                     <Switch
//                       id="isActive"
//                       checked={watch("isActive")}
//                       onCheckedChange={(checked) =>
//                         setValue("isActive", checked)
//                       }
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Profile Picture */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Profile Picture</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-col items-center space-y-4">
//                   <Avatar className="h-24 w-24">
//                     <AvatarImage src={user.profilePic || "/placeholder.svg"} />
//                     <AvatarFallback className="text-lg">
//                       {user.firstName?.[0]}
//                       {user.lastName?.[0]}
//                     </AvatarFallback>
//                   </Avatar>
//                   <Button variant="outline" size="sm">
//                     <Upload className="h-4 w-4 mr-2" />
//                     Upload New Photo
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Actions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   {isSubmitting ? "Saving..." : "Save Changes"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => router.back()}
//                 >
//                   Cancel
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Danger Zone */}
//             <Card className="border-red-200">
//               <CardHeader>
//                 <CardTitle className="text-red-600">Danger Zone</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button variant="destructive" size="sm" className="w-full">
//                   Reset Password
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="w-full text-red-600 border-red-200"
//                 >
//                   Delete Account
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
