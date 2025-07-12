import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { User, UserRoles, UserRolesEnum } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "../../filters";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  FileTextIcon,
  InfoIcon,
  Trash2Icon,
  UserCogIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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

interface UserTableRowProps {
  user: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setShowUserInfoDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUserDocumentsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setNewRole: React.Dispatch<React.SetStateAction<UserRoles>>;
  setShowChangeRoleDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteUser: (userId: string) => void;
}

function UsersTableRow({
  user,
  setSelectedUser,
  setShowUserInfoDialog,
  setNewRole,
  handleDeleteUser,
  setShowUserDocumentsDialog,
  setShowChangeRoleDialog,
}: UserTableRowProps) {
  return (
    <TableRow key={user._id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar?.url || "/placeholder.svg"}
              alt={user.fullname}
            />
            <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.fullname}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge
          variant={user.role === UserRolesEnum.ADMIN ? "default" : "secondary"}
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        {user.isEmailVerified ? (
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
      </TableCell>
      <TableCell>{format(new Date(user.createdAt), "MMM dd, yyyy")}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {/* Info Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserInfoDialog(true);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Change Role Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(
                      user.role === UserRolesEnum.ADMIN
                        ? UserRolesEnum.CUSTOMER
                        : UserRolesEnum.ADMIN
                    );
                    setShowChangeRoleDialog(true);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <UserCogIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Role</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Documents Button */}
          {user.documents && user.documents.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserDocumentsDialog(true);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <FileTextIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Documents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Delete Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.fullname}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UsersTableRow;
