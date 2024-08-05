import { getEventByID } from "@/app/actions";

const EventID = async ({ params }: { params: { id: string } }) => {
  const event = await getEventByID(params.id);

  return <div>
    {event && <>
      <meta property="og:title" content={event.Event_Title} />
      <meta property="og:description" content={event.Description || ''} />
      <meta property="og:image" content={event.Event_Image_URL} />
      <p className="text-textHeading">{event.Event_Image_URL}</p>
    </>
    }
  </div>
}

export default EventID;