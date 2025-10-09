import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import {
  GET_PLATFORM_SETTINGS,
  UPDATE_PLATFORM_SETTING,
} from "../../../graphql/settings";
import { UPDATE_PLATFORM_SETTINGS } from "../../../graphql/mutations/admin";
import {
  Loader2,
  Settings,
  Shield,
  Database,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedBy: string;
  updater?: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PlatformConfig {
  maintenanceMode: boolean;
  userRegistration: boolean;
  propertySubmissions: boolean;
  autoApproveProperties: boolean;
  maxFileSize: number;
  supportEmail: string;
  platformName: string;
  platformDescription: string;
  termsUrl: string;
  privacyUrl: string;
  maxPropertiesPerUser: number;
  verificationRequired: boolean;
  emailVerificationRequired: boolean;
  phoneVerificationRequired: boolean;
}

export default function PlatformSettingsPage() {
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    maintenanceMode: false,
    userRegistration: true,
    propertySubmissions: true,
    autoApproveProperties: false,
    maxFileSize: 10,
    supportEmail: "support@glubon.com",
    platformName: "Glubon",
    platformDescription: "Find your perfect rental property",
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    maxPropertiesPerUser: 10,
    verificationRequired: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: false,
  });

  const [customSettings, setCustomSettings] = useState<PlatformSetting[]>([]);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: "",
  });

  const { loading: settingsLoading, refetch } = useQuery(
    GET_PLATFORM_SETTINGS,
    {
      variables: { page: 1, limit: 100 },
      onCompleted: (data) => {
        if (data.getPlatformSettings?.items) {
          setCustomSettings(data.getPlatformSettings.items);

          // Map known settings to platform config
          const settings = data.getPlatformSettings.items;
          const config = { ...platformConfig };

          settings.forEach((setting: PlatformSetting) => {
            switch (setting.key) {
              case "maintenance_mode":
                config.maintenanceMode = setting.value === "true";
                break;
              case "user_registration":
                config.userRegistration = setting.value === "true";
                break;
              case "property_submissions":
                config.propertySubmissions = setting.value === "true";
                break;
              case "auto_approve_properties":
                config.autoApproveProperties = setting.value === "true";
                break;
              case "max_file_size":
                config.maxFileSize = parseInt(setting.value) || 10;
                break;
              case "support_email":
                config.supportEmail = setting.value;
                break;
              case "platform_name":
                config.platformName = setting.value;
                break;
              case "platform_description":
                config.platformDescription = setting.value;
                break;
              case "terms_url":
                config.termsUrl = setting.value;
                break;
              case "privacy_url":
                config.privacyUrl = setting.value;
                break;
              case "max_properties_per_user":
                config.maxPropertiesPerUser = parseInt(setting.value) || 10;
                break;
              case "verification_required":
                config.verificationRequired = setting.value === "true";
                break;
              case "email_verification_required":
                config.emailVerificationRequired = setting.value === "true";
                break;
              case "phone_verification_required":
                config.phoneVerificationRequired = setting.value === "true";
                break;
            }
          });

          setPlatformConfig(config);
        }
      },
    }
  );

  const [updatePlatformSettings, { loading: updateLoading }] = useMutation(
    UPDATE_PLATFORM_SETTINGS,
    {
      onCompleted: () => {
        toast.success("Platform settings have been updated successfully.");

        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [updateSetting, { loading: settingUpdateLoading }] = useMutation(
    UPDATE_PLATFORM_SETTING,
    {
      onCompleted: () => {
        toast.success("Custom setting has been updated successfully.");

        refetch();
        setNewSetting({ key: "", value: "", description: "" });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handlePlatformConfigUpdate = () => {
    updatePlatformSettings({
      variables: {
        input: platformConfig,
      },
    });
  };

  const handleAddCustomSetting = () => {
    if (!newSetting.key || !newSetting.value) {
      toast.error("Key and value are required.");

      return;
    }

    updateSetting({
      variables: {
        input: newSetting,
      },
    });
  };

  const handleUpdateCustomSetting = (
    setting: PlatformSetting,
    newValue: string
  ) => {
    updateSetting({
      variables: {
        input: {
          key: setting.key,
          value: newValue,
          description: setting.description,
        },
      },
    });
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>Configure basic platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={platformConfig.platformName}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    platformName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={platformConfig.supportEmail}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    supportEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformDescription">Platform Description</Label>
            <Textarea
              id="platformDescription"
              value={platformConfig.platformDescription}
              onChange={(e) =>
                setPlatformConfig((prev) => ({
                  ...prev,
                  platformDescription: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="termsUrl">Terms of Service URL</Label>
              <Input
                id="termsUrl"
                value={platformConfig.termsUrl}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    termsUrl: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
              <Input
                id="privacyUrl"
                value={platformConfig.privacyUrl}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    privacyUrl: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>System Controls</span>
          </CardTitle>
          <CardDescription>
            Control platform functionality and access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable the platform for maintenance
                  </p>
                </div>
              </div>
              <Switch
                checked={platformConfig.maintenanceMode}
                onCheckedChange={(checked) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    maintenanceMode: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>User Registration</Label>
                <p className="text-sm text-gray-500">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={platformConfig.userRegistration}
                onCheckedChange={(checked) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    userRegistration: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Property Submissions</Label>
                <p className="text-sm text-gray-500">
                  Allow users to submit new properties
                </p>
              </div>
              <Switch
                checked={platformConfig.propertySubmissions}
                onCheckedChange={(checked) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    propertySubmissions: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Auto-approve Properties</Label>
                <p className="text-sm text-gray-500">
                  Automatically approve new property submissions
                </p>
              </div>
              <Switch
                checked={platformConfig.autoApproveProperties}
                onCheckedChange={(checked) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    autoApproveProperties: checked,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Verification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure user verification requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Verification Required</Label>
              <p className="text-sm text-gray-500">
                Require users to verify their identity
              </p>
            </div>
            <Switch
              checked={platformConfig.verificationRequired}
              onCheckedChange={(checked) =>
                setPlatformConfig((prev) => ({
                  ...prev,
                  verificationRequired: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Email Verification Required</Label>
              <p className="text-sm text-gray-500">
                Require email verification for new accounts
              </p>
            </div>
            <Switch
              checked={platformConfig.emailVerificationRequired}
              onCheckedChange={(checked) =>
                setPlatformConfig((prev) => ({
                  ...prev,
                  emailVerificationRequired: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Phone Verification Required</Label>
              <p className="text-sm text-gray-500">
                Require phone verification for new accounts
              </p>
            </div>
            <Switch
              checked={platformConfig.phoneVerificationRequired}
              onCheckedChange={(checked) =>
                setPlatformConfig((prev) => ({
                  ...prev,
                  phoneVerificationRequired: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Limits & Quotas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Limits & Quotas</span>
          </CardTitle>
          <CardDescription>Set platform limits and quotas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={platformConfig.maxFileSize}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    maxFileSize: parseInt(e.target.value) || 10,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPropertiesPerUser">
                Max Properties Per User
              </Label>
              <Input
                id="maxPropertiesPerUser"
                type="number"
                value={platformConfig.maxPropertiesPerUser}
                onChange={(e) =>
                  setPlatformConfig((prev) => ({
                    ...prev,
                    maxPropertiesPerUser: parseInt(e.target.value) || 10,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Settings</CardTitle>
          <CardDescription>Manage custom platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Setting */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-medium">Add New Setting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Setting key"
                value={newSetting.key}
                onChange={(e) =>
                  setNewSetting((prev) => ({ ...prev, key: e.target.value }))
                }
              />
              <Input
                placeholder="Setting value"
                value={newSetting.value}
                onChange={(e) =>
                  setNewSetting((prev) => ({ ...prev, value: e.target.value }))
                }
              />
              <Input
                placeholder="Description"
                value={newSetting.description}
                onChange={(e) =>
                  setNewSetting((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              onClick={handleAddCustomSetting}
              disabled={settingUpdateLoading}
            >
              {settingUpdateLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Setting
            </Button>
          </div>

          {/* Existing Settings */}
          <div className="space-y-4">
            {customSettings.map((setting) => (
              <div key={setting.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{setting.key}</Badge>
                    <span className="text-sm text-gray-500">
                      {setting.description}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Updated by {setting.updater?.email || "System"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={setting.value}
                    onChange={(e) =>
                      handleUpdateCustomSetting(setting, e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handlePlatformConfigUpdate}
          disabled={updateLoading}
          size="lg"
        >
          {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Platform Settings
        </Button>
      </div>
    </div>
  );
}
