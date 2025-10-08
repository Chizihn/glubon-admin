import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Plus, FileText, Newspaper, HelpCircle, File } from "lucide-react";

type ContentType = 'page' | 'post' | 'news' | 'faq' | 'custom';
type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled' | 'trash';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  updatedAt: string;
  views?: number;
}

const ContentsPage = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('page');
  
  // Mock data - replace with actual data fetching
  const [contents] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Welcome to Glubon',
      slug: 'welcome',
      type: 'page',
      status: 'published',
      author: 'Admin User',
      updatedAt: '2023-05-15T10:30:00Z',
      views: 1245
    },
    {
      id: '2',
      title: 'Getting Started Guide',
      slug: 'getting-started',
      type: 'post',
      status: 'published',
      author: 'Support Team',
      updatedAt: '2023-05-10T14:20:00Z',
      views: 876
    },
    {
      id: '3',
      title: 'Latest Updates',
      slug: 'latest-updates',
      type: 'news',
      status: 'published',
      author: 'Editor',
      updatedAt: '2023-05-05T09:15:00Z',
      views: 1532
    },
    {
      id: '4',
      title: 'How to Use the Dashboard',
      slug: 'dashboard-guide',
      type: 'faq',
      status: 'draft',
      author: 'Support Team',
      updatedAt: '2023-04-28T11:45:00Z',
      views: 0
    }
  ]);

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

  const getStatusBadge = (status: ContentStatus) => {
    const statusMap = {
      draft: { label: 'Draft', variant: 'outline' as const },
      published: { label: 'Published', variant: 'default' as const },
      archived: { label: 'Archived', variant: 'secondary' as const },
      scheduled: { label: 'Scheduled', variant: 'outline' as const },
      trash: { label: 'Trash', variant: 'destructive' as const },
    };
    
    const { label, variant } = statusMap[status] || { label: 'Unknown', variant: 'outline' as const };
    return <Badge variant={variant} className="capitalize">{label}</Badge>;
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'post':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'news':
        return <Newspaper className="h-4 w-4 mr-2" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4 mr-2" />;
      default:
        return <File className="h-4 w-4 mr-2" />;
    }
  };

  const filteredContents = contents.filter(content => content.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-gray-500">Create and manage your website content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)}>
        <TabsList>
          <TabsTrigger value="page">
            <FileText className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="post">
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="custom">
            <File className="h-4 w-4 mr-2" />
            Custom
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {filteredContents.map((content) => (
            <Card key={content.id} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(content.type)}
                    <div>
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>/{content.slug}</span>
                        <span>•</span>
                        <span>By {content.author}</span>
                        <span>•</span>
                        <span>{new Date(content.updatedAt).toLocaleDateString()}</span>
                        {content.views !== undefined && (
                          <>
                            <span>•</span>
                            <span>{content.views.toLocaleString()} views</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(content.status)}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredContents.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} content found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new {activeTab}.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ContentsPage;

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
//               href={`/dashboard/content-management/email-templates/${template.id}`}
//             >
//               <Eye className="h-4 w-4" />
//             </Link>
//           </Button>
//           <Button variant="ghost" size="sm" asChild>
//             <Link
//               href={`/dashboard/content-management/email-templates/${template.id}/edit`}
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
