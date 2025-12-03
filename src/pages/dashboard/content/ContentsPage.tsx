import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Plus, FileText, Newspaper, HelpCircle, File, Loader2 } from "lucide-react";
import { GET_CONTENTS, GET_FAQS } from "@/graphql/queries/content";
import { ErrorState } from "@/components/ui/ErrorState";

type ContentType = 'page' | 'post' | 'news' | 'faq' | 'custom';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED' | 'TRASH';

interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  type: ContentType;
  status: ContentStatus | string;
  author: string;
  updatedAt: string;
  views?: number;
}

const ContentsPage = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('page');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Query for generic content (Page, Post, News)
  const { 
    data: contentData, 
    loading: contentLoading, 
    error: contentError,
    refetch: refetchContent
  } = useQuery(GET_CONTENTS, {
    variables: { 
      filters: { 
        types: [activeTab.toUpperCase()],
        page,
        limit
      } 
    },
    skip: activeTab === 'faq',
    fetchPolicy: "cache-and-network"
  });

  // Query for FAQs
  const { 
    data: faqData, 
    loading: faqLoading, 
    error: faqError,
    refetch: refetchFaqs
  } = useQuery(GET_FAQS, {
    skip: activeTab !== 'faq',
    fetchPolicy: "cache-and-network"
  });

  const isLoading = activeTab === 'faq' ? faqLoading : contentLoading;
  const error = activeTab === 'faq' ? faqError : contentError;

  const items: ContentItem[] = useMemo(() => {
    if (activeTab === 'faq') {
      return (faqData?.getFAQs || []).map((faq: any) => ({
        id: faq.id,
        title: faq.question,
        type: 'faq',
        status: faq.isActive ? 'PUBLISHED' : 'DRAFT',
        author: faq.updatedBy, // This is an ID, ideally we'd resolve it or the backend would return a User object
        updatedAt: faq.updatedAt,
        views: 0 // FAQs might not have view counts in this query
      }));
    } else {
      return (contentData?.contents?.items || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        type: item.type.toLowerCase(),
        status: item.status,
        author: item.author ? `${item.author.firstName} ${item.author.lastName}` : 'Unknown',
        updatedAt: item.updatedAt,
        views: item.viewCount
      }));
    }
  }, [activeTab, faqData, contentData]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: 'Draft', variant: 'outline' },
      PUBLISHED: { label: 'Published', variant: 'default' },
      ARCHIVED: { label: 'Archived', variant: 'secondary' },
      SCHEDULED: { label: 'Scheduled', variant: 'outline' },
      TRASH: { label: 'Trash', variant: 'destructive' },
      // FAQ specific
      true: { label: 'Active', variant: 'default' },
      false: { label: 'Inactive', variant: 'secondary' }
    };
    
    // Handle boolean status from FAQ mapping if needed, though we mapped to strings above
    const normalizedStatus = status === 'true' || status === 'PUBLISHED' ? 'PUBLISHED' : 
                             status === 'false' ? 'DRAFT' : status;

    const { label, variant } = statusMap[normalizedStatus] || { label: status, variant: 'outline' };
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

  if (error) {
    return (
      <ErrorState 
        title="Failed to load content" 
        message={error.message} 
        onRetry={() => activeTab === 'faq' ? refetchFaqs() : refetchContent()} 
      />
    );
  }

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
        </TabsList>

        <div className="mt-6 space-y-4">
          {isLoading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
             </div>
          ) : (
            <>
              {items.map((content) => (
                <Card key={content.id} className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(content.type)}
                        <div>
                          <h3 className="font-medium">{content.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            {content.slug && <span>/{content.slug}</span>}
                            {content.slug && <span>•</span>}
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
              
              {items.length === 0 && (
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
            </>
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
