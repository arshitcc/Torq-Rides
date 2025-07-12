import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, UserRolesEnum } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { getInitials } from "../../filters";

interface UserInfoDialogProps {
  selectedUser: User | null;
  setShowUserInfoDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showUserInfoDialog: boolean;
}

function UserInfoDialog({
  selectedUser,
  setShowUserInfoDialog,
  showUserInfoDialog,
}: UserInfoDialogProps) {
  return (
    <Dialog open={showUserInfoDialog} onOpenChange={setShowUserInfoDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={selectedUser.avatar?.url || "/placeholder.svg"}
                  alt={selectedUser.fullname}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(selectedUser.fullname)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedUser.fullname}
                </h3>
                <p className="text-gray-600">@{selectedUser.username}</p>
                <Badge
                  variant={
                    selectedUser.role === UserRolesEnum.ADMIN
                      ? "default"
                      : "secondary"
                  }
                  className="mt-1"
                >
                  {selectedUser.role}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Email
                </Label>
                <p className="mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Phone
                </Label>
                <p className="mt-1">{selectedUser.phone || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Verification Status
                </Label>
                <p className="mt-1">
                  {selectedUser.isEmailVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircleIcon className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Joined Date
                </Label>
                <p className="mt-1">
                  {format(new Date(selectedUser.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            {selectedUser.address && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Address
                </Label>
                <p className="mt-1">{selectedUser.address}</p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Documents
              </Label>
              <p className="mt-1">
                {selectedUser.documents?.length || 0} document(s) uploaded
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserInfoDialog;
