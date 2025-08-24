// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Badge } from "../../../components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

// import {
//   Edit,
//   FileText,
//   HelpCircle,
//   Mail,
//   Plus,
//   Eye,
//   Trash2,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { DataTable } from "../../../components/ui/datatable";

// export default function ContentManagementPage() {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Mock data for static pages
//   const staticPages = [
//     {
//       id: "1",
//       title: "Privacy Policy",
//       slug: "privacy-policy",
//       status: "PUBLISHED",
//       lastModified: "2024-01-15T10:30:00Z",
//       modifiedBy: "John Admin",
//     },
//     {
//       id: "2",
//       title: "Terms of Service",
//       slug: "terms-of-service",
//       status: "PUBLISHED",
//       lastModified: "2024-01-14T15:20:00Z",
//       modifiedBy: "Jane Admin",
//     },
//     {
//       id: "3",
//       title: "About Us",
//       slug: "about-us",
//       status: "DRAFT",
//       lastModified: "2024-01-13T09:45:00Z",
//       modifiedBy: "Mike Content",
//     },
//   ];

//   // Mock data for FAQs
//   const faqs = [
//     {
//       id: "1",
//       question: "How do I list my property?",
//       category: "LISTING",
//       status: "PUBLISHED",
//       views: 1250,
//       lastModified: "2024-01-15T10:30:00Z",
//     },
//     {
//       id: "2",
//       question: "What are the payment methods accepted?",
//       category: "PAYMENT",
//       status: "PUBLISHED",
//       views: 890,
//       lastModified: "2024-01-14T14:20:00Z",
//     },
//     {
//       id: "3",
//       question: "How does the verification process work?",
//       category: "VERIFICATION",
//       status: "DRAFT",
//       views: 0,
//       lastModified: "2024-01-13T16:15:00Z",
//     },
//   ];

//   // Mock data for email templates
//   const emailTemplates = [
//     {
//       id: "1",
//       name: "Welcome Email",
//       type: "TRANSACTIONAL",
//       status: "ACTIVE",
//       lastSent: "2024-01-15T10:30:00Z",
//       sentCount: 1250,
//     },
//     {
//       id: "2",
//       name: "Property Approved",
//       type: "NOTIFICATION",
//       status: "ACTIVE",
//       lastSent: "2024-01-15T09:15:00Z",
//       sentCount: 89,
//     },
//     {
//       id: "3",
//       name: "Monthly Newsletter",
//       type: "MARKETING",
//       status: "DRAFT",
//       lastSent: null,
//       sentCount: 0,
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PUBLISHED":
//       case "ACTIVE":
//         return "bg-green-100 text-green-800";
//       case "DRAFT":
//         return "bg-yellow-100 text-yellow-800";
//       case "INACTIVE":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const staticPagesColumns = [
//     {
//       key: "title",
//       label: "Page Title",
//       render: (title: string, page: any) => (
//         <div>
//           <p className="font-medium text-gray-900">{title}</p>
//           <p className="text-sm text-gray-500">/{page.slug}</p>
//         </div>
//       ),
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (status: string) => (
//         <Badge className={getStatusColor(status)}>{status}</Badge>
//       ),
//     },
//     {
//       key: "lastModified",
//       label: "Last Modified",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       key: "modifiedBy",
//       label: "Modified By",
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (_, page: any) => (
//         <div className="flex space-x-2">
//           <Button variant="ghost" size="sm" asChild>
//             <Link to={`/dashboard/content-management/pages/${page.id}`}>
//               <Eye className="h-4 w-4" />
//             </Link>
//           </Button>
//           <Button variant="ghost" size="sm" asChild>
//             <Link to={`/dashboard/content-management/pages/${page.id}/edit`}>
//               <Edit className="h-4 w-4" />
//             </Link>
//           </Button>
//           <Button variant="ghost" size="sm">
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const faqColumns = [
//     {
//       key: "question",
//       label: "Question",
//       render: (question: string) => (
//         <p className="font-medium text-gray-900 max-w-md truncate">
//           {question}
//         </p>
//       ),
//     },
//     {
//       key: "category",
//       label: "Category",
//       render: (category: string) => <Badge variant="outline">{category}</Badge>,
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (status: string) => (
//         <Badge className={getStatusColor(status)}>{status}</Badge>
//       ),
//     },
//     {
//       key: "views",
//       label: "Views",
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (_, faq: any) => (
//         <div className="flex space-x-2">
//           <Button variant="ghost" size="sm" asChild>
//             <Link to={`/dashboard/content-management/faqs/${faq.id}/edit`}>
//               <Edit className="h-4 w-4" />
//             </Link>
//           </Button>
//           <Button variant="ghost" size="sm">
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const emailTemplateColumns = [
//     {
//       key: "name",
//       label: "Template Name",
//     },
//     {
//       key: "type",
//       label: "Type",
//       render: (type: string) => <Badge variant="outline">{type}</Badge>,
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (status: string) => (
//         <Badge className={getStatusColor(status)}>{status}</Badge>
//       ),
//     },
//     {
//       key: "sentCount",
//       label: "Sent Count",
//     },
//     {
//       key: "lastSent",
//       label: "Last Sent",
//       render: (date: string | null) =>
//         date ? new Date(date).toLocaleDateString() : "Never",
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (_, template: any) => (
//         <div className="flex space-x-2">
//           <Button variant="ghost" size="sm" asChild>
//             <Link
//               to={`/dashboard/content-management/email-templates/${template.id}`}
//             >
//               <Eye className="h-4 w-4" />
//             </Link>
//           </Button>
//           <Button variant="ghost" size="sm" asChild>
//             <Link
//               to={`/dashboard/content-management/email-templates/${template.id}/edit`}
//             >
//               <Edit className="h-4 w-4" />
//             </Link>
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
//         <p className="text-gray-600">
//           Manage static pages, FAQs, and email templates
//         </p>
//       </div>

//       <Tabs defaultValue="pages" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="pages">Static Pages</TabsTrigger>
//           <TabsTrigger value="faqs">FAQs</TabsTrigger>
//           <TabsTrigger value="emails">Email Templates</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pages">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <FileText className="mr-2 h-5 w-5" />
//                     Static Pages
//                   </CardTitle>
//                   <CardDescription>
//                     Manage privacy policy, terms of service, and other static
//                     content
//                   </CardDescription>
//                 </div>
//                 <Button asChild>
//                   <Link to="/dashboard/content-management/pages/create">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create Page
//                   </Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <DataTable
//                 data={staticPages}
//                 columns={staticPagesColumns}
//                 searchable
//                 searchPlaceholder="Search pages..."
//                 loading={false}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="faqs">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <HelpCircle className="mr-2 h-5 w-5" />
//                     FAQ Management
//                   </CardTitle>
//                   <CardDescription>
//                     Create and organize frequently asked questions
//                   </CardDescription>
//                 </div>
//                 <Button asChild>
//                   <Link to="/dashboard/content-management/faqs/create">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create FAQ
//                   </Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <DataTable
//                 data={faqs}
//                 columns={faqColumns}
//                 searchable
//                 searchPlaceholder="Search FAQs..."
//                 loading={false}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="emails">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="flex items-center">
//                     <Mail className="mr-2 h-5 w-5" />
//                     Email Templates
//                   </CardTitle>
//                   <CardDescription>
//                     Customize notification and marketing email templates
//                   </CardDescription>
//                 </div>
//                 <Button asChild>
//                   <Link to="/dashboard/content-management/email-templates/create">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create Template
//                   </Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <DataTable
//                 data={emailTemplates}
//                 columns={emailTemplateColumns}
//                 searchable
//                 searchPlaceholder="Search templates..."
//                 loading={false}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
