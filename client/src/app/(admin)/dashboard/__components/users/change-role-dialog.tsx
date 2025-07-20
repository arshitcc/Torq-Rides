import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRoles, UserRolesEnum } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AssignRoleFormData } from "@/schemas/users.schema";

interface ChangeRoleDialogProps {
  setShowChangeRoleDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showChangeRoleDialog: boolean;
  selectedUser: User | null;
  newRole: UserRoles;
  setNewRole: React.Dispatch<React.SetStateAction<UserRoles>>;
  handleChangeUserRole: (data: AssignRoleFormData, userId: string) => void;
}

function ChangeRoleDialog({
  setShowChangeRoleDialog,
  showChangeRoleDialog,
  selectedUser,
  newRole,
  setNewRole,
  handleChangeUserRole,
}: ChangeRoleDialogProps) {
  return (
    <Dialog open={showChangeRoleDialog} onOpenChange={setShowChangeRoleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-4">
            <p>
              Change role for <strong>{selectedUser.fullname}</strong>
            </p>
            <div className="space-y-2">
              <Label>Select New Role</Label>
              <Select
                value={newRole}
                onValueChange={(value: UserRoles) => setNewRole(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRolesEnum.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRolesEnum.CUSTOMER}>
                    Customer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowChangeRoleDialog(false)}
              >
                Cancel
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Change Role
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to change {selectedUser.fullname}'s
                      role to {newRole}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleChangeUserRole(
                          { role: newRole },
                          selectedUser._id
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Confirm Change
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ChangeRoleDialog;
