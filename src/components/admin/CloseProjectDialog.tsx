import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { Download, AlertTriangle, Square, Trash2 } from 'lucide-react';
import { printShutdownGuide } from './printShutdownGuide';

interface CloseProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CloseProjectDialog({ open, onOpenChange }: CloseProjectDialogProps) {
  const handlePrint = printShutdownGuide;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            Azure Project Shutdown Guide
          </DialogTitle>
          <DialogDescription>
            Complete guide to stopping or deleting your Azure resources
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 text-sm'>
          {/* Warning Section */}
          <div className='p-4 bg-orange-50 border border-orange-200 rounded-lg print:border-black'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
              <div>
                <h3 className='font-semibold text-orange-900 mb-1'>Important Notice</h3>
                <p className='text-orange-800 text-sm'>
                  Deleting resources is permanent and cannot be undone. However, your code will
                  still exist on GitHub and can be set up again if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Delete Resources Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-red-300'>
              <Trash2 className='w-5 h-5 text-red-600' />
              <h2 className='text-lg font-semibold text-red-700'>
                Shut Down Project: Delete All Resources
              </h2>
            </div>

            <div className='space-y-4 pl-7'>
              <div className='p-3 bg-red-50 border border-red-200 rounded'>
                <p className='text-red-800 text-sm font-medium'>
                  ⚠️ This action is irreversible. All data will be permanently lost.
                </p>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Delete Entire Resource Group</h3>
                <p className='text-gray-600 text-sm mb-2 italic'>
                  A Resource Group is like a folder that contains all parts of your project
                  (website, backend, database, etc.)
                </p>
                <ol className='list-decimal list-inside space-y-1 text-gray-700 ml-2'>
                  <li>Navigate to the Azure Portal (portal.azure.com)</li>
                  <li>
                    Open the portal menu, and go to "Resource groups". It is located in the left
                    side of the upper menu
                  </li>
                  <li>Find and click on your Resource Group (sustainability-canvas)</li>
                  <li>Click "Delete resource group" at the top</li>
                  <li>Type the resource group name to confirm</li>
                  <li>Click "Delete"</li>
                  <li>Wait 5-15 minutes for Azure to complete the deletion</li>
                </ol>
                <p className='text-sm text-gray-600 mt-2 italic'>
                  This will delete everything: the website, backend processing, database with all
                  data, and any other resources in the group.
                </p>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Delete Individual Resources (Alternative)</h3>
                <p className='text-gray-700 mb-2'>If you want to keep some parts of the project:</p>
                <ol className='list-decimal list-inside space-y-1 text-gray-700 ml-2'>
                  <li>Open your Resource Group</li>
                  <li>Select the checkbox next to each resource you want to delete</li>
                  <li>Click "Delete" at the top</li>
                  <li>Confirm each deletion</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg print:border-black'>
            <h3 className='font-semibold mb-2 text-blue-900'>Understanding Costs</h3>
            <ul className='list-disc list-inside space-y-1 text-blue-800 text-sm ml-2'>
              <li>
                <strong>The Website:</strong> It is currently on the free tier, there are no costs
                whether it's running or not.
              </li>
              <li>
                <strong>The Backend Processing:</strong> With a consumption plan, you only pay when
                it's being used with more than 1 million executions per month. This would be
                equivalent to thousands of hours of continuous use.
              </li>
              <li>
                <strong>The Database:</strong> You're charged for the space it takes up and the
                computing power, even when stopped. This amounts to about 12-14 euros per month for
                the current setup.
              </li>
            </ul>
          </div>

          {/* GitHub Code Preservation */}
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg print:border-black'>
            <h3 className='font-semibold mb-2 text-green-900'>Your Code is Safe on GitHub</h3>
            <p className='text-green-800 text-sm'>
              Even if you delete everything in Azure, a complete copy of your project's code is
              stored on GitHub (a code sharing platform). This means the project can be set up again
              in the future if needed. Only the live website and database data will be permanently
              removed.
            </p>
          </div>

          {/* Stop Resources Section - Advanced */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-gray-400'>
              <Square className='w-5 h-5 text-gray-600' />
              <h2 className='text-lg font-semibold text-gray-700'>
                Advanced: Temporarily Stop Resources
              </h2>
            </div>

            <div className='p-3 bg-gray-50 border border-gray-300 rounded'>
              <p className='text-gray-700 text-sm'>
                ⚠️ <strong>Advanced Users Only:</strong> These steps require familiarity with Azure
                Portal. If you're not comfortable with cloud infrastructure, consider asking someone
                technical for help or simply deleting the entire resource group above.
              </p>
            </div>

            <div className='space-y-4 pl-7'>
              <p className='text-gray-600 text-sm mb-3'>
                Stopping resources can reduce costs temporarily, but some services may still incur
                charges:
              </p>

              <div>
                <h3 className='font-semibold mb-2'>1. Stop the Backend (Azure Functions)</h3>
                <p className='text-gray-600 text-sm mb-2 italic'>
                  The backend handles all the processing and data storage behind the scenes of your
                  app
                </p>
                <ol className='list-decimal list-inside space-y-1 text-gray-700 ml-2'>
                  <li>Navigate to the Azure Portal (portal.azure.com)</li>
                  <li>Go to your Resource Group</li>
                  <li>Select the Function App</li>
                  <li>Click "Stop" in the top menu bar</li>
                  <li>Wait for confirmation that the app has stopped</li>
                  <li className='text-amber-700 font-medium'>
                    Note: You may still be charged for the hosting plan if using one
                  </li>
                </ol>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>2. Stop the Database (PostgreSQL)</h3>
                <p className='text-gray-600 text-sm mb-2 italic'>
                  The database stores all your project data, user accounts, and information
                </p>
                <ol className='list-decimal list-inside space-y-1 text-gray-700 ml-2'>
                  <li>In your Resource Group, select the PostgreSQL server</li>
                  <li>Click "Stop" in the top menu bar</li>
                  <li>Confirm the action</li>
                  <li className='text-amber-700 font-medium'>
                    Note: The database will automatically restart after 7 days. You'll still be
                    charged for storage space.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>3. The Website (Static Web App)</h3>
                <p className='text-gray-600 text-sm mb-2 italic'>
                  This is the actual website that users see and interact with in their browser
                </p>
                <div className='p-3 bg-amber-50 border border-amber-200 rounded mb-2'>
                  <p className='text-amber-800 text-sm font-medium'>
                    ℹ️ The website cannot be temporarily stopped - it can only be completely deleted
                    or you can disable automatic updates via GitHub Actions
                  </p>
                </div>
                <p className='text-gray-700 text-sm'>
                  To prevent automatic updates to the website, you can disable GitHub Actions (see
                  instructions above)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t print:hidden'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className='flex items-center gap-2'>
            <Download className='w-4 h-4' />
            Download as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
