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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { useAuthStore } from "../../../store/authStore";
import {
  GET_USER_SETTINGS,
  UPDATE_USER_SETTINGS,
} from "../../../graphql/settings";
import {
  UPDATE_ADMIN_PROFILE,
  CHANGE_ADMIN_PASSWORD,
  TOGGLE_TWO_FACTOR_AUTH,
} from "../../../graphql/mutations/admin";
import { Loader2, Camera, Shield, Bell, Palette } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UserSettings {
  theme: string;
  language: string;
  receivePromotions: boolean;
  pushNotifications: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    newUsers: boolean;
    propertySubmissions: boolean;
    verificationRequests: boolean;
    systemAlerts: boolean;
  };
}

export default function UserSettingsPage() {
  const { user } = useAuthStore();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    theme: "light",
    language: "en",
    receivePromotions: true,
    pushNotifications: true,
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      newUsers: true,
      propertySubmissions: true,
      verificationRequests: true,
      systemAlerts: true,
    },
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // GraphQL queries and mutations
  const { loading: settingsLoading } = useQuery(GET_USER_SETTINGS, {
    onCompleted: (data) => {
      if (data.getUserSettings) {
        setSettings({
          theme: data.getUserSettings.theme || "light",
          language: data.getUserSettings.language || "en",
          receivePromotions: data.getUserSettings.receivePromotions || false,
          pushNotifications: data.getUserSettings.pushNotifications || false,
          notificationPreferences:
            data.getUserSettings.notificationPreferences ||
            settings.notificationPreferences,
        });
      }
    },
  });
  const [updateProfile, { loading: profileLoading }] = useMutation(
    UPDATE_ADMIN_PROFILE,
    {
      onCompleted: () => {
        toast.success("Your profile has been updated successfully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [changePassword, { loading: passwordLoading }] = useMutation(
    CHANGE_ADMIN_PASSWORD,
    {
      onCompleted: () => {
        toast.success("Your password has been changed successfully.");

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [updateSettings, { loading: settingsUpdateLoading }] = useMutation(
    UPDATE_USER_SETTINGS,
    {
      onCompleted: () => {
        toast.success("Your settings have been updated successfully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [toggleTwoFactor, { loading: twoFactorLoading }] = useMutation(
    TOGGLE_TWO_FACTOR_AUTH,
    {
      onCompleted: () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        toast.info(twoFactorEnabled ? "2FA Disabled" : "2FA Enabled");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      variables: {
        input: profileForm,
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");

      return;
    }

    changePassword({
      variables: {
        input: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      },
    });
  };

  const handleSettingsUpdate = () => {
    updateSettings({
      variables: {
        input: settings,
      },
    });
  };

  const handleTwoFactorToggle = () => {
    toggleTwoFactor({
      variables: {
        enabled: !twoFactorEnabled,
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
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={profileForm.phoneNumber}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
            </div>

            <Button type="submit" disabled={profileLoading}>
              {profileLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div>
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button
              variant={twoFactorEnabled ? "destructive" : "default"}
              onClick={handleTwoFactorToggle}
              disabled={twoFactorLoading}
            >
              {twoFactorLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.email}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive push notifications
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.push}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      push: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>New User Registrations</Label>
                <p className="text-sm text-gray-500">
                  Get notified when new users register
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.newUsers}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      newUsers: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Property Submissions</Label>
                <p className="text-sm text-gray-500">
                  Get notified about new property submissions
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.propertySubmissions}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      propertySubmissions: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Verification Requests</Label>
                <p className="text-sm text-gray-500">
                  Get notified about verification requests
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.verificationRequests}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      verificationRequests: checked,
                    },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>System Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified about system alerts
                </p>
              </div>
              <Switch
                checked={settings.notificationPreferences.systemAlerts}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      systemAlerts: checked,
                    },
                  }))
                }
              />
            </div>
          </div>

          <Button
            onClick={handleSettingsUpdate}
            disabled={settingsUpdateLoading}
          >
            {settingsUpdateLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Preferences</span>
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Promotional Emails</Label>
              <p className="text-sm text-gray-500">
                Receive promotional emails and updates
              </p>
            </div>
            <Switch
              checked={settings.receivePromotions}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, receivePromotions: checked }))
              }
            />
          </div>

          <Button
            onClick={handleSettingsUpdate}
            disabled={settingsUpdateLoading}
          >
            {settingsUpdateLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
