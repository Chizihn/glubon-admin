/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { DataTable } from "../../../components/ui/datatable";
import { formatGraphQLError } from "../../../util/formatGraphQlError";
import { MoreHorizontal, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../../components/ui/input";
import { AdPosition, AdStatus, AdType as AdTypeEnum } from "@prisma/client";
import { GET_ALL_ADS, CREATE_AD, UPDATE_AD_STATUS } from "../../../graphql/queries/ads";
import type { AdType } from "../../../types/ad";

const createAdSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL"),
  targetUrl: z.string().url("Invalid URL"),
  position: z.enum([AdPosition.TOP_BANNER, AdPosition.SIDE_BANNER, AdPosition.IN_FEED]),
  type: z.enum([AdTypeEnum.STANDARD, AdTypeEnum.PREMIUM]).optional().default(AdTypeEnum.STANDARD),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  budget: z.number().optional(),
  costPerClick: z.number().optional(),
});

export default function AdsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AdStatus | undefined>(undefined);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data, loading, refetch } = useQuery(GET_ALL_ADS, {
    variables: {
      filter: statusFilter ? { status: statusFilter } : null,
      page: currentPage,
      limit: 20,
    },
  });

  const [createAd] = useMutation(CREATE_AD);
  const [updateAdStatus] = useMutation(UPDATE_AD_STATUS);

  const form = useForm<z.infer<typeof createAdSchema>>({
    resolver: zodResolver(createAdSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      targetUrl: "",
      position: AdPosition.TOP_BANNER,
      type: AdTypeEnum.STANDARD,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      budget: undefined,
      costPerClick: undefined,
    },
  });

  const handleStatusUpdate = async (adId: string, status: AdStatus) => {
    try {
      const result = await updateAdStatus({
        variables: {
          input: {
            id: adId,
            status,
          },
        },
      });

      if (result.data?.updateAdStatus?.success) {
        toast.success("Ad status updated successfully");
        refetch();
      } else {
        toast.error(result.data?.updateAdStatus?.errors?.[0] || "Failed to update ad status");
      }
    } catch (error) {
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "An error occurred!");
      console.error("Status update error:", errMsg);
    }
  };

  const handleCreateAd = async (values: z.infer<typeof createAdSchema>) => {
    try {
      const result = await createAd({
        variables: {
          input: {
            ...values,
            startDate: new Date(values.startDate),
            endDate: new Date(values.endDate),
          },
        },
      });

      if (result.data?.createAd) {
        toast.success("Ad created successfully");
        setShowCreateForm(false);
        form.reset();
        refetch();
      } else {
        toast.error("Failed to create ad");
      }
    } catch (error) {
      const errMsg = formatGraphQLError(error);
      toast.error(errMsg || "An error occurred!");
      console.error("Create ad error:", errMsg);
    }
  };

  const getStatusColor = (status: AdStatus) => {
    switch (status) {
      case AdStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case AdStatus.PAUSED:
        return "bg-yellow-100 text-yellow-800";
      case AdStatus.COMPLETED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPositionColor = (position: AdPosition) => {
    switch (position) {
      case AdPosition.TOP_BANNER:
        return "bg-blue-100 text-blue-800";
      case AdPosition.SIDE_BANNER:
        return "bg-purple-100 text-purple-800";
      case AdPosition.IN_FEED:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (title: string, ad: AdType) => (
        <div className="flex items-center space-x-3">
          <img src={ad.imageUrl} alt={title} className="h-8 w-8 object-cover rounded" />
          <p className="font-medium text-gray-900">{title}</p>
        </div>
      ),
    },
    {
      key: "position",
      label: "Position",
      render: (position: AdPosition) => (
        <Badge className={getPositionColor(position)}>{position.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: AdStatus) => (
        <Badge className={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, ad: AdType) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/ads/${ad.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(ad.id, AdStatus.ACTIVE)}
              disabled={ad.status === AdStatus.ACTIVE}
            >
              Activate Ad
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(ad.id, AdStatus.PAUSED)}
              disabled={ad.status === AdStatus.PAUSED}
            >
              Pause Ad
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(ad.id, AdStatus.COMPLETED)}
              disabled={ad.status === AdStatus.COMPLETED}
              className="text-red-600"
            >
              Complete Ad
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-600">Manage platform advertisements</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Create New Ad"}
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button
          variant={statusFilter === undefined ? "default" : "outline"}
          onClick={() => setStatusFilter(undefined)}
        >
          All
        </Button>
        <Button
          variant={statusFilter === AdStatus.ACTIVE ? "default" : "outline"}
          onClick={() => setStatusFilter(AdStatus.ACTIVE)}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === AdStatus.PAUSED ? "default" : "outline"}
          onClick={() => setStatusFilter(AdStatus.PAUSED)}
        >
          Paused
        </Button>
        <Button
          variant={statusFilter === AdStatus.COMPLETED ? "default" : "outline"}
          onClick={() => setStatusFilter(AdStatus.COMPLETED)}
        >
          Completed
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Ad</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAd)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AdPosition.TOP_BANNER}>Top Banner</SelectItem>
                        <SelectItem value={AdPosition.SIDE_BANNER}>Side Banner</SelectItem>
                        <SelectItem value={AdPosition.IN_FEED}>In-Feed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AdTypeEnum.STANDARD}>Standard</SelectItem>
                        <SelectItem value={AdTypeEnum.PREMIUM}>Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costPerClick"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per Click (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Ad</Button>
            </form>
          </Form>
        </div>
      )}

      <DataTable
        data={data?.getAllAds || []}
        columns={columns}
        searchable
        searchPlaceholder="Search ads..."
        loading={loading}
        pagination={{
          currentPage,
          totalPages: data?.getAllAds?.pagination?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}