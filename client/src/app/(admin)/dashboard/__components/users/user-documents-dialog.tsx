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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { EyeIcon, FileTextIcon, Trash2Icon } from "lucide-react";

interface UserDocumentsDialogProps {
  showUserDocumentsDialog: boolean;
  setShowUserDocumentsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: User | null;
  handleDeleteUserDocument: (userId: string, documentId: string) => void;
}

function UserDocumentsDialog({
  showUserDocumentsDialog,
  setShowUserDocumentsDialog,
  selectedUser,
  handleDeleteUserDocument,
}: UserDocumentsDialogProps) {
  return (
    <Dialog
      open={showUserDocumentsDialog}
      onOpenChange={setShowUserDocumentsDialog}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Documents</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-4">
            <p>
              Documents for <strong>{selectedUser.fullname}</strong>
            </p>
            {selectedUser.documents && selectedUser.documents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {selectedUser.documents.map((doc: any) => (
                  <Card key={doc._id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-500/10 p-2 rounded-full">
                          <FileTextIcon className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          {doc.name && (
                            <p className="text-sm text-gray-600">{doc.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file.url, "_blank")}
                          className="flex-1 sm:flex-none"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none bg-transparent"
                            >
                              <Trash2Icon className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Document
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this {doc.type}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteUserDocument(
                                    selectedUser._id,
                                    doc._id
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Document
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents uploaded</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserDocumentsDialog;
