import { CanvasSection } from './CanvasSection';

export function SustainabilityCanvas() {
  return (
    <div className='w-full p-6'>
      <div className='grid grid-cols-5 gap-4 mb-4'>
        {/* First Row */}
        <CanvasSection
          title='Key Stakeholders (KS)'
          description='Who are your key partners and stakeholders?'
          backgroundColor='bg-the-light-blue border-the-light-blue'
        />
        <CanvasSection
          title='Key Activities (KA)'
          description='What key activities does your value proposition require?'
          backgroundColor='bg-the-light-blue border-the-light-blue'
        />
        <CanvasSection
          title='Unique Value Proposition (UVP)'
          description='What unique value do you deliver to customers?'
          backgroundColor='bg-the-lavender'
        />
        <CanvasSection
          title='Customer Relationship (CR)'
          description='How do you build relationships with customers?'
          backgroundColor='bg-the-yellow'
        />
        <CanvasSection
          title='Customer Segment (CS)'
          description='Who are your target customers?'
          backgroundColor='bg-the-yellow'
        />
      </div>

      <div className='grid grid-cols-5 gap-4'>
        {/* Second Row */}
        <CanvasSection
          title='Waste Management (WM)'
          description='How do you handle waste and circular economy?'
          backgroundColor='bg-the-light-blue'
        />
        <CanvasSection
          title='Key Technology & Resources (KTR)'
          description='What key resources and technologies do you need?'
          backgroundColor='bg-the-light-blue'
        />

        {/* Cost and Revenue Column */}
        <div className='flex flex-col gap-4'>
          <CanvasSection
            title='Cost (CO)'
            description='What are your key costs?'
            backgroundColor='bg-the-orange'
            className='flex-1'
          />
          <CanvasSection
            title='Revenue (RE)'
            description='How do you generate revenue?'
            backgroundColor='bg-the-green'
            className='flex-1'
          />
        </div>

        <CanvasSection
          title='Channels (CH)'
          description='Through which channels do you reach customers?'
          backgroundColor='bg-the-yellow'
        />
        <CanvasSection
          title='Governance (GO)'
          description='How is your organization governed?'
          backgroundColor='bg-the-yellow'
        />
      </div>
    </div>
  );
}
