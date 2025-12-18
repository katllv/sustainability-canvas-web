// Utility to print the Azure Project Shutdown Guide as a clean PDF/printout
export function printShutdownGuide() {
  const printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Azure Project Shutdown Guide</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            font-size: 14px;
          }
          h1 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
          h2 { font-size: 18px; font-weight: 600; margin-top: 24px; margin-bottom: 12px; padding-bottom: 8px; }
          h3 { font-size: 16px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
          p { margin: 8px 0; }
          ol, ul { margin: 8px 0; padding-left: 24px; }
          li { margin: 4px 0; }
          .notice { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .notice-icon { color: #ea580c; }
          .delete-section { border-top: 2px solid #fca5a5; padding-top: 16px; }
          .delete-section h2 { color: #b91c1c; }
          .warning { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 12px; margin: 12px 0; color: #991b1b; font-weight: 500; }
          .info { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .advanced { border-top: 2px solid #d1d5db; padding-top: 16px; margin-top: 24px; }
          .advanced h2 { color: #4b5563; }
          .advanced-warning { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; margin: 12px 0; }
          .italic { font-style: italic; color: #6b7280; }
          .note { color: #d97706; font-weight: 500; }
          @page {
            size: portrait;
            margin: 15mm;
          }
          @media print {
            body { padding: 20px; }
            .notice, .warning, .info, .success, .advanced-warning { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h1>Azure Project Shutdown Guide</h1>
        <p class="italic">Complete guide to stopping or deleting your Azure resources</p>

        <div class="notice">
          <p><strong>Important Notice</strong></p>
          <p>Deleting resources is permanent and cannot be undone. However, your code will still exist on GitHub and can be set up again if needed.</p>
        </div>

        <div class="delete-section">
          <h2>Shut Down Project: Delete All Resources</h2>

          <div class="warning">
            ⚠️ This action is irreversible. All data will be permanently lost.
          </div>

          <h3>Delete Entire Resource Group</h3>
          <p class="italic">A Resource Group is like a folder that contains all parts of your project (website, backend, database, etc.)</p>
          <ol>
            <li>Navigate to the Azure Portal (portal.azure.com)</li>
            <li>Open the portal menu, and go to "Resource groups". It is located in the left side of the upper menu</li>
            <li>Find and click on your Resource Group (sustainability-canvas)</li>
            <li>Click "Delete resource group" at the top</li>
            <li>Type the resource group name to confirm</li>
            <li>Click "Delete"</li>
            <li>Wait 5-15 minutes for Azure to complete the deletion</li>
          </ol>
          <p class="italic">This will delete everything: the website, backend processing, database with all data, and any other resources in the group.</p>

          <h3>Delete Individual Resources (Alternative)</h3>
          <p>If you want to keep some parts of the project:</p>
          <ol>
            <li>Open your Resource Group</li>
            <li>Select the checkbox next to each resource you want to delete</li>
            <li>Click "Delete" at the top</li>
            <li>Confirm each deletion</li>
          </ol>
        </div>

        <div class="success">
          <h3>Your Code is Safe on GitHub</h3>
          <p>Even if you delete everything in Azure, a complete copy of your project's code is stored on GitHub (a code sharing platform). This means the project can be set up again in the future if needed. Only the live website and database data will be permanently removed.</p>
        </div>

        <div class="info">
          <h3>Understanding Costs</h3>
          <ul>
            <li><strong>The Website:</strong> It is currently on the free tier, there are no costs whether it's running or not.</li>
            <li><strong>The Backend Processing:</strong> With a consumption plan, you only pay when it's being used with more than 1 million executions per month. This would be equivalent to thousands of hours of continuous use.</li>
            <li><strong>The Database:</strong> You're charged for the space it takes up and the computing power, even when stopped. This amounts to about 12-14 euros per month for the current setup.</li>
          </ul>
        </div>

        <div class="advanced">
          <h2>Advanced: Temporarily Stop Resources</h2>

          <div class="advanced-warning">
            <p>⚠️ <strong>Advanced Users Only:</strong> These steps require familiarity with Azure Portal. If you're not comfortable with cloud infrastructure, consider asking someone technical for help or simply deleting the entire resource group above.</p>
          </div>

          <p>Stopping resources can reduce costs temporarily, but some services may still incur charges:</p>

          <h3>1. Stop the Backend (Azure Functions)</h3>
          <p class="italic">The backend handles all the processing and data storage behind the scenes of your app</p>
          <ol>
            <li>Navigate to the Azure Portal (portal.azure.com)</li>
            <li>Go to your Resource Group</li>
            <li>Select the Function App</li>
            <li>Click "Stop" in the top menu bar</li>
            <li>Wait for confirmation that the app has stopped</li>
            <li class="note">Note: You may still be charged for the hosting plan if using one</li>
          </ol>

          <h3>2. Stop the Database (PostgreSQL)</h3>
          <p class="italic">The database stores all your project data, user accounts, and information</p>
          <ol>
            <li>In your Resource Group, select the PostgreSQL server</li>
            <li>Click "Stop" in the top menu bar</li>
            <li>Confirm the action</li>
            <li class="note">Note: The database will automatically restart after 7 days. You'll still be charged for storage space.</li>
          </ol>

          <h3>3. The Website (Static Web App)</h3>
          <p class="italic">This is the actual website that users see and interact with in their browser</p>
          <div class="notice">
            <p>ℹ️ The website cannot be temporarily stopped - it can only be completely deleted or you can disable automatic updates via GitHub Actions</p>
          </div>
          <p>To prevent automatic updates to the website, you can disable GitHub Actions (see your GitHub repository settings)</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
