# Advice plan implementation

## What Needs to Be Dones

on schools SSJ, for the Advice list container, we need an action button in the upper right with 4 drop down options: initiate visioning Advice, conclude visioning Advice, reopen visioning advice, initiate planning Advice, conclude planning Advice, reopen planning advice. Description of what happens to follow.

#contents of an advice card in the advice container:
  title = name of advice giver (via lookup using people_id or guide_id) on advice_requested_date
  subtitle = "Advice"
  body = advice_submitted, advice_given_date, advice_text, links to advice_docs_public_urls
  subtitle = "Response"
  body = advice_loop_closed, advice_loop_closed_date, response_to_advice, links to loop_closed_public_urls


#initiate visioning Advice

- open modal:
    - "TL members of the panel:" and a multiselect drop down of everyone in the people table where is_archived = false
    - "Partner members of the panel:" and a multiselect drop down of everyone in the guides table where is_active = true and is_archived = false
    buttons that say initiate requests or cancel.

    if they hit initiate, - mark field visioning_advice_loop_status = Open, then enter one record in the Advice table for each person (TL or guide) they'll be requested Advice from, using advice_giver_people_id for TLs and advice_giver_guide_id for partners. advice_requested_date is today. stage is 'Visioning'.
    
    send an email to each person participating in the panel using the central mail service (not personal gmail) that says:
       Thank you for agreeing to provide Advice to {the current_tls at the school} as they work to open their school {school_name}.
       When you are ready to share Advice, click this link: ____________

    when the person clicks the link, it should bring them to a page that does not require them to sign in that says:
        -Advice panel for school_name
        -Advice stage: Visioning
        -Advice giver: the person who received the email and is responding
        -Advice requested date: {advice_requested_date}

        "Please share your Advice with the team in the text box below, and/or by uploading any documents"

        -a large multiline text box labeled "Advice"
        -a field to upload attachments

        button options to save cancel or submit
        on save, save the text they have so that its there if they come back from their original link - put it in the same fields as submit below for text and objects. however, leave advice_submitted as false or null.
        on submit, update the record in the Advice table with advice_text (the text box), add any attachments to storage.objects(bucket_id = 'Advice') put the array of objects.ids into advice_docs_object_ids uuid[] and the corresponding public urls into advice_docs_public_urls text[]. mark advice_given_date as today. set advice_submitted to true.
        send them to a page that says thank you for providing your Advice.
        if the person has saved the Advice and follows the original link again, they should come back to their page where it was. if they have already submitted the Advice and they click the link again, they should get a web page that says this Advice has already been submitted.

        send an email to the primary emails of the current tls at the school letting them know that they have received Advice from {advice_giver_people_id or _guide_id} - and include the text of the Advice and links to any docs in the email.

#initiate planning advice 
works the same way except that the stage is planning and field names should swap planning for visioning

#conclude visioning advice

- open modal:
    show a list container with cards for each of the people/guides who were asked for advice, with the date they were asked for advice, whether they submitted advice (advice_submitted), the date they gave advice, whether they closed the loop (advice_loop_closed) and the date they closed the loop, and a link to another popup that will show advice_text and links to the advice_docs_public_urls and loop_closing_text and response_to_advice and loop_closing_public_urls. in each card, show a drop down action button that with options:
        "enter/upload advice" which if they hit that should open another modal where the user can input advice_text and upload documents that will go in the advice_docs_object_ids and advice_docs_public_urls fields.
        "enter/upload response to advice" which if they hit that should open another modal where the user can input response_to_advice and upload docs that will go in loop_closing_object_ids and loop_closing _public_urls
       "close loop" which switches advice_loop_closed to true and makes advice_loop_closed_date editable and sets it to today and shows save and cancel buttons. if they hit save, update the record with the advice_loop_closed and date. once the advice loop has been closed for a person, show a button that says reopen advice for this advice giver. if they hit that update row so that advice_loop_closed is false and advice_loop_closed_date is null
        If there are any cards where advice loop hasn't been closed, there should be a message saying "Not all advice has been given and reponded to. Are you sure you want to end this phase of the advice process?" if all have been closed, say "Are you ready to end this phase of the advice process?" buttons in both place are proceed and cancel. if they hit proceed, set school_ssj_data.visioning_advice_loop_status to 'Complete'

#conclude planning advice
same as visioning except for the stage is planning and field names replace visioning with planning

#reopen visioning advice
popup confirmation
switch school_ssj_data.visioning_advice_loop_status to 'Open'

#reopen planning advice
similar to visioning but for planning

#abandon visioning advice
switch school_ssj_data.visioning_advice_loop_status to 'Abandoned'
switch school_ssj_data.ssj_stage = "Paused"
switch schools.status = "Paused"

#abandon planning advice
same pattern as visioning