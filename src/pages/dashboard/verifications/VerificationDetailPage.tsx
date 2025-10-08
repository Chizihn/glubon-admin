import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft } from "lucide-react";

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
type DocumentType = 'ID_CARD' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'UTILITY_BILL' | 'OTHER';

const VerificationDetailPage = () => {
  const { id: verificationId } = useParams<{ id: string }>();
  const [loading] = useState(false);
  const [verification] = useState<{
    id: string;
    status: VerificationStatus;
    documentType: DocumentType;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  } | null>({
    id: verificationId || '',
    status: 'PENDING',
    documentType: 'ID_CARD',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date().toISOString(),
  });

  const getStatusBadge = (status: VerificationStatus) => {
    const statusMap = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">Verification not found</h2>
          <p className="text-gray-500 mt-2">The requested verification could not be found.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Verification Details</h1>
          <p className="text-gray-500">View and manage verification request</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {verification.firstName} {verification.lastName}
            </CardTitle>
            <Badge className={`${getStatusBadge(verification.status)}`}>
              {verification.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Document Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Document Type:</span> {verification.documentType.replace('_', ' ')}</p>
                <p><span className="text-gray-500">Submitted:</span> {new Date(verification.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Email:</span> {verification.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex space-x-4">
              <Button variant="outline">View Document</Button>
              <Button variant="outline">View Selfie</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationDetailPage;
//     try {
//       await reviewVerification({
//         variables: {
//           input: {
//             verificationId,
//             approved,
//             reason: reviewReason || undefined,
//           },
//         },
//       });

//       toast({
//         title: "Success",
//         description: `Verification ${
//           approved ? "approved" : "rejected"
//         } successfully`,
//       });

//       setSelectedAction(null);
//       setReviewReason("");
//       refetch();
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
//           <div className="lg:col-span-2 space-y-6">
//             <div className="h-64 bg-gray-200 rounded animate-pulse" />
//             <div className="h-96 bg-gray-200 rounded animate-pulse" />
//           </div>
//           <div className="space-y-6">
//             <div className="h-48 bg-gray-200 rounded animate-pulse" />
//             <div className="h-32 bg-gray-200 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!verification) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900">
//           Verification not found
//         </h2>
//         <p className="text-gray-600 mt-2">
//           The verification you're looking for doesn't exist.
//         </p>
//         <Button onClick={() => router.back()} className="mt-4">
//           Go Back
//         </Button>
//       </div>
//     );
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "APPROVED":
//         return "bg-green-100 text-green-800";
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "REJECTED":
//         return "bg-red-100 text-red-800";
//       case "IN_REVIEW":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getDocumentTypeLabel = (type: string) => {
//     switch (type) {
//       case "NIN":
//         return "National ID";
//       case "DRIVERS_LICENSE":
//         return "Driver's License";
//       case "INTERNATIONAL_PASSPORT":
//         return "International Passport";
//       case "VOTERS_CARD":
//         return "Voter's Card";
//       case "UTILITY_BILL":
//         return "Utility Bill";
//       case "BANK_STATEMENT":
//         return "Bank Statement";
//       default:
//         return type.replace("_", " ");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div className="flex items-center space-x-4">
//           <Button variant="outline" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Verification Review
//             </h1>
//             <p className="text-gray-600">
//               {getDocumentTypeLabel(verification.documentType)} Verification
//             </p>
//             <div className="flex items-center space-x-2 mt-1">
//               <Badge className={getStatusColor(verification.status)}>
//                 {verification.status}
//               </Badge>
//               <span className="text-sm text-gray-500">
//                 Submitted{" "}
//                 {new Date(verification.submittedAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {verification.status === "PENDING" && (
//           <div className="flex space-x-2">
//             <Button
//               onClick={() => handleReview(true)}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               <CheckCircle className="h-4 w-4 mr-2" />
//               Approve
//             </Button>
//             <Button onClick={() => handleReview(false)} variant="destructive">
//               <XCircle className="h-4 w-4 mr-2" />
//               Reject
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2">
//           <Tabs defaultValue="documents" className="space-y-6">
//             <TabsList>
//               <TabsTrigger value="documents">Documents</TabsTrigger>
//               <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
//               <TabsTrigger value="history">History</TabsTrigger>
//               <TabsTrigger value="notes">Notes</TabsTrigger>
//             </TabsList>

//             <TabsContent value="documents" className="space-y-6">
//               {/* Document Images */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Submitted Documents</CardTitle>
//                   <CardDescription>
//                     Review the documents submitted by the user
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {verification.documents.map((doc: any, index: number) => (
//                       <div key={doc.id} className="space-y-2">
//                         <div className="relative">
//                           <img
//                             src={doc.url || "/placeholder.svg"}
//                             alt={`Document ${index + 1}`}
//                             className="w-full h-64 object-cover rounded-lg border"
//                           />
//                           <div className="absolute top-2 right-2 flex space-x-1">
//                             <Button
//                               size="icon"
//                               variant="secondary"
//                               className="h-8 w-8"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               size="icon"
//                               variant="secondary"
//                               className="h-8 w-8"
//                             >
//                               <Download className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                         <div className="text-sm">
//                           <p className="font-medium">{doc.fileName}</p>
//                           <p className="text-gray-500">
//                             {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                           <p className="text-gray-500">
//                             Uploaded{" "}
//                             {new Date(doc.uploadedAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Document Details */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Document Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Document Type</p>
//                       <p className="font-medium">
//                         {getDocumentTypeLabel(verification.documentType)}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-sm text-gray-600">Document Number</p>
//                       <p className="font-medium font-mono">
//                         {verification.documentNumber}
//                       </p>
//                     </div>

//                     {verification.details?.issuingAuthority && (
//                       <div>
//                         <p className="text-sm text-gray-600">
//                           Issuing Authority
//                         </p>
//                         <p className="font-medium">
//                           {verification.details.issuingAuthority}
//                         </p>
//                       </div>
//                     )}

//                     {verification.details?.issueDate && (
//                       <div>
//                         <p className="text-sm text-gray-600">Issue Date</p>
//                         <p className="font-medium">
//                           {new Date(
//                             verification.details.issueDate
//                           ).toLocaleDateString()}
//                         </p>
//                       </div>
//                     )}

//                     {verification.details?.expiryDate && (
//                       <div>
//                         <p className="text-sm text-gray-600">Expiry Date</p>
//                         <p className="font-medium">
//                           {new Date(
//                             verification.details.expiryDate
//                           ).toLocaleDateString()}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="analysis">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>AI Analysis Results</CardTitle>
//                   <CardDescription>
//                     Automated analysis of the submitted documents
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {verification.aiAnalysis && (
//                     <>
//                       {/* Overall Assessment */}
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="text-center p-4 border rounded-lg">
//                           <p className="text-2xl font-bold text-blue-600">
//                             {verification.aiAnalysis.confidence}%
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             Confidence Score
//                           </p>
//                         </div>

//                         <div className="text-center p-4 border rounded-lg">
//                           <p className="text-2xl font-bold text-green-600">
//                             {verification.aiAnalysis.documentValidation
//                               ?.confidence || 0}
//                             %
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             Document Validity
//                           </p>
//                         </div>

//                         {verification.aiAnalysis.faceMatch && (
//                           <div className="text-center p-4 border rounded-lg">
//                             <p className="text-2xl font-bold text-purple-600">
//                               {verification.aiAnalysis.faceMatch.confidence}%
//                             </p>
//                             <p className="text-sm text-gray-600">Face Match</p>
//                           </div>
//                         )}
//                       </div>

//                       {/* Flags and Issues */}
//                       {verification.aiAnalysis.flags &&
//                         verification.aiAnalysis.flags.length > 0 && (
//                           <div>
//                             <h4 className="font-medium mb-3 flex items-center">
//                               <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
//                               Detected Issues
//                             </h4>
//                             <div className="space-y-2">
//                               {verification.aiAnalysis.flags.map(
//                                 (flag: string, index: number) => (
//                                   <div
//                                     key={index}
//                                     className="flex items-center space-x-2 p-2 bg-yellow-50 rounded"
//                                   >
//                                     <AlertTriangle className="h-4 w-4 text-yellow-500" />
//                                     <span className="text-sm">{flag}</span>
//                                   </div>
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         )}

//                       {/* Extracted Data */}
//                       {verification.aiAnalysis.extractedData &&
//                         verification.aiAnalysis.extractedData.length > 0 && (
//                           <div>
//                             <h4 className="font-medium mb-3">
//                               Extracted Information
//                             </h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {verification.aiAnalysis.extractedData.map(
//                                 (data: any, index: number) => (
//                                   <div
//                                     key={index}
//                                     className="border rounded-lg p-3"
//                                   >
//                                     <p className="text-sm text-gray-600">
//                                       {data.field}
//                                     </p>
//                                     <p className="font-medium">{data.value}</p>
//                                     <p className="text-xs text-gray-500">
//                                       Confidence: {data.confidence}%
//                                     </p>
//                                   </div>
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         )}

//                       {/* Recommendations */}
//                       {verification.aiAnalysis.recommendations &&
//                         verification.aiAnalysis.recommendations.length > 0 && (
//                           <div>
//                             <h4 className="font-medium mb-3">
//                               AI Recommendations
//                             </h4>
//                             <ul className="space-y-2">
//                               {verification.aiAnalysis.recommendations.map(
//                                 (rec: string, index: number) => (
//                                   <li
//                                     key={index}
//                                     className="flex items-start space-x-2"
//                                   >
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
//                                     <span className="text-sm">{rec}</span>
//                                   </li>
//                                 )
//                               )}
//                             </ul>
//                           </div>
//                         )}
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="history">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Review History</CardTitle>
//                   <CardDescription>
//                     Timeline of all actions taken on this verification
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {verification.reviewHistory?.map((history: any) => (
//                       <div
//                         key={history.id}
//                         className="flex items-start space-x-3 border-b pb-3"
//                       >
//                         <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">
//                             {history.action}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {history.reason}
//                           </p>
//                           <div className="flex items-center space-x-2 mt-1">
//                             <span className="text-xs text-gray-500">
//                               by {history.reviewer.name}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {new Date(history.timestamp).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                         <Badge className={getStatusColor(history.status)}>
//                           {history.status}
//                         </Badge>
//                       </div>
//                     )) || (
//                       <p className="text-center text-gray-500 py-8">
//                         No review history available
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="notes">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Review Notes</CardTitle>
//                   <CardDescription>
//                     Add notes and comments about this verification
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label htmlFor="reviewReason">Review Notes</Label>
//                     <Textarea
//                       id="reviewReason"
//                       value={reviewReason}
//                       onChange={(e) => setReviewReason(e.target.value)}
//                       placeholder="Add your review notes here..."
//                       rows={4}
//                     />
//                   </div>

//                   <div className="flex space-x-2">
//                     <Button
//                       onClick={() => handleReview(true)}
//                       className="bg-green-600 hover:bg-green-700"
//                     >
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Approve with Notes
//                     </Button>
//                     <Button
//                       onClick={() => handleReview(false)}
//                       variant="destructive"
//                     >
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject with Notes
//                     </Button>
//                   </div>

//                   {/* Existing Notes */}
//                   <div className="space-y-3 mt-6">
//                     <h4 className="font-medium">Previous Notes</h4>
//                     {verification.notes?.map((note: any) => (
//                       <div key={note.id} className="border rounded-lg p-3">
//                         <p className="text-sm">{note.content}</p>
//                         <div className="flex items-center space-x-2 mt-2">
//                           <span className="text-xs text-gray-500">
//                             by {note.author.name}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {new Date(note.createdAt).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     )) || (
//                       <p className="text-sm text-gray-500">No previous notes</p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* User Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>User Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center space-x-3 mb-4">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage
//                     src={verification.user.profilePic || "/placeholder.svg"}
//                   />
//                   <AvatarFallback>
//                     {verification.user.firstName?.[0]}
//                     {verification.user.lastName?.[0]}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h4 className="font-medium">
//                     {verification.user.firstName} {verification.user.lastName}
//                   </h4>
//                   <p className="text-sm text-gray-600">
//                     {verification.user.email}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {verification.user.role}
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={() =>
//                   router.push(`/dashboard/users/${verification.user.id}`)
//                 }
//               >
//                 <User className="h-4 w-4 mr-2" />
//                 View User Profile
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Verification Stats */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Verification Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Type</span>
//                 <span className="font-medium">{verification.type}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Priority</span>
//                 <Badge
//                   className={
//                     verification.priority === "HIGH"
//                       ? "bg-red-100 text-red-800"
//                       : verification.priority === "MEDIUM"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-green-100 text-green-800"
//                   }
//                 >
//                   {verification.priority}
//                 </Badge>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Submitted</span>
//                 <span className="text-sm">
//                   {new Date(verification.submittedAt).toLocaleDateString()}
//                 </span>
//               </div>

//               {verification.reviewStartedAt && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Review Started</span>
//                   <span className="text-sm">
//                     {new Date(
//                       verification.reviewStartedAt
//                     ).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}

//               {verification.assignedTo && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Assigned To</span>
//                   <span className="text-sm">
//                     {verification.assignedTo.name}
//                   </span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Related Verifications */}
//           {verification.relatedVerifications &&
//             verification.relatedVerifications.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Related Verifications</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {verification.relatedVerifications.map((related: any) => (
//                     <div
//                       key={related.id}
//                       className="flex items-center justify-between"
//                     >
//                       <div>
//                         <p className="font-medium text-sm">{related.type}</p>
//                         <p className="text-xs text-gray-500">
//                           {related.relationship}
//                         </p>
//                       </div>
//                       <Badge className={getStatusColor(related.status)}>
//                         {related.status}
//                       </Badge>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}

//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Button variant="outline" className="w-full justify-start">
//                 <FileText className="h-4 w-4 mr-2" />
//                 Request Additional Docs
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Shield className="h-4 w-4 mr-2" />
//                 Escalate Review
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <AlertTriangle className="h-4 w-4 mr-2" />
//                 Flag for Investigation
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
