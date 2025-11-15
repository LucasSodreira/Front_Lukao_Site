import type { User } from "@/types/domain/user";

import { environment } from "@/config/environment";
import { buildHeadersWithCsrf } from "@/utils/csrf";

const BASE_URL = `${environment.apiUrl}/api/users`;

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface EnableTwoFactorResponse {
  qrCode: string;
  secret: string;
}

export interface VerifyTwoFactorRequest {
  code: string;
  secret: string;
}

export interface UserDevice {
  id: string;
  name: string;
  type: "DESKTOP" | "MOBILE" | "TABLET";
  browser?: string;
  os?: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  isCurrentSession: boolean;
}

export interface UserSession {
  id: string;
  devices: UserDevice[];
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  },

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return await response.json();
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/password`, {
      method: "POST",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }
  },

  async enableTwoFactor(): Promise<EnableTwoFactorResponse> {
    const response = await fetch(`${BASE_URL}/2fa/enable`, {
      method: "POST",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to enable 2FA: ${response.statusText}`);
    }

    return await response.json();
  },

  async verifyTwoFactor(data: VerifyTwoFactorRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/2fa/verify`, {
      method: "POST",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to verify 2FA: ${response.statusText}`);
    }
  },

  async disableTwoFactor(): Promise<void> {
    const response = await fetch(`${BASE_URL}/2fa/disable`, {
      method: "POST",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to disable 2FA: ${response.statusText}`);
    }
  },

  async getSessions(): Promise<UserSession> {
    const response = await fetch(`${BASE_URL}/sessions`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    return await response.json();
  },

  async disconnectDevice(deviceId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/sessions/devices/${deviceId}`, {
      method: "DELETE",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect device: ${response.statusText}`);
    }
  },

  async disconnectAllDevices(): Promise<void> {
    const response = await fetch(`${BASE_URL}/sessions/disconnect-all`, {
      method: "POST",
      headers: await buildHeadersWithCsrf(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to disconnect all devices: ${response.statusText}`
      );
    }
  },

  async isTwoFactorEnabled(): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/2fa/status`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.enabled === true;
  },
};
