import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { User, UserRoles, UserRolesEnum } from "@/types";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import UserInfoDialog from "./users/user-info-dialog";
import ChangeRoleDialog from "./users/change-role-dialog";
import UserDocumentsDialog from "./users/user-documents-dialog";
import { AssignRoleFormData } from "@/schemas/users.schema";
import UsersTableRow from "./users/users-table-row";
import { UsersTableRowSkeleton } from "./utils";
import { useAuthStore } from "@/store/auth-store";

interface UsersTabProps {
  users: User[];
  userMetadata: any;
  handleDeleteUser: (userId: string) => void;
  handleChangeUserRole: (data: AssignRoleFormData, userId: string) => void;
  handleDeleteUserDocument: (userId: string, documentId: string) => void;
  setUsersCurrentPage: (page: number) => void;
  usersCurrentPage: number;
  totalUsersPages: number;
  userSearchTerm: string;
  setUserSearchTerm: (term: string) => void;
  userVerificationFilter: "all" | "verified" | "unverified";
  setUserVerificationFilter: (
    filter: "all" | "verified" | "unverified"
  ) => void;
  userRoleFilter: "all" | UserRoles;
  setUserRoleFilter: (filter: "all" | UserRoles) => void;
}

export default function UsersTab({
  users,
  userMetadata,
  handleDeleteUser,
  handleChangeUserRole,
  handleDeleteUserDocument,
  setUsersCurrentPage,
  usersCurrentPage,
  totalUsersPages,
  userSearchTerm,
  setUserSearchTerm,
  userVerificationFilter,
  setUserVerificationFilter,
  userRoleFilter,
  setUserRoleFilter,
}: UsersTabProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [showUserDocumentsDialog, setShowUserDocumentsDialog] = useState(false);
  const [newRole, setNewRole] = useState<UserRoles>(UserRolesEnum.CUSTOMER);

  const { loading } = useAuthStore();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: {userMetadata.total}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-3/5">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by name, email, or username..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full lg:w-2/5 flex justify-between gap-4">
          <div className="lg:w-1/2 flex flex-col justify-center items-center">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Status
            </Label>
            <Select
              value={userVerificationFilter}
              onValueChange={(value: "all" | "verified" | "unverified") =>
                setUserVerificationFilter(value)
              }
            >
              <SelectTrigger className="mx-auto">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center items-center">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </Label>
            <Select
              value={userRoleFilter}
              onValueChange={(value: "all" | UserRoles) =>
                setUserRoleFilter(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value={UserRolesEnum.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRolesEnum.CUSTOMER}>Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-yellow-primary/20 mb-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <UsersTableRowSkeleton key={index} />
                  ))
                : users.map((user) => (
                    <UsersTableRow
                      key={user._id}
                      user={user}
                      setSelectedUser={setSelectedUser}
                      setShowUserInfoDialog={setShowUserInfoDialog}
                      setShowUserDocumentsDialog={setShowUserDocumentsDialog}
                      setNewRole={setNewRole}
                      setShowChangeRoleDialog={setShowChangeRoleDialog}
                      handleDeleteUser={handleDeleteUser}
                    />
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalUsersPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setUsersCurrentPage(Math.max(usersCurrentPage - 1, 1))
                }
                className={
                  usersCurrentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalUsersPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setUsersCurrentPage(i + 1)}
                  isActive={usersCurrentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setUsersCurrentPage(
                    Math.min(usersCurrentPage + 1, totalUsersPages)
                  )
                }
                className={
                  usersCurrentPage === totalUsersPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* User Info Dialog */}
      <UserInfoDialog
        selectedUser={selectedUser}
        showUserInfoDialog={showUserInfoDialog}
        setShowUserInfoDialog={setShowUserInfoDialog}
      />

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        selectedUser={selectedUser}
        newRole={newRole}
        setNewRole={setNewRole}
        showChangeRoleDialog={showChangeRoleDialog}
        setShowChangeRoleDialog={setShowChangeRoleDialog}
        handleChangeUserRole={handleChangeUserRole}
      />

      {/* User Documents Dialog */}
      <UserDocumentsDialog
        showUserDocumentsDialog={showUserDocumentsDialog}
        setShowUserDocumentsDialog={setShowUserDocumentsDialog}
        selectedUser={selectedUser}
        handleDeleteUserDocument={handleDeleteUserDocument}
      />
    </>
  );
}
