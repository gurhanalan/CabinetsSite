import { useEffect, useRef } from 'react'

// Zoho CRM WebToLead form embedded as a React component.
// Required hidden inputs and field names are preserved.
export default function ZohoForm() {
  const ref = useRef(null)

  useEffect(() => {
    const form = ref.current?.querySelector('form')
    const splash = ref.current?.querySelector('#wf_splash')
    const splashInfo = ref.current?.querySelector('#wf_splash_info')
    const privacy = ref.current?.querySelector('#privacyTool6985731000000589853')
    const privacyErr = ref.current?.querySelector('#privacyErr6985731000000589853')
    const emailInput = ref.current?.querySelector('#Email')
    const emailErr = ref.current?.querySelector('#EmailErr')
    const mobileInput = ref.current?.querySelector('#Mobile')
    const mobileErr = ref.current?.querySelector('#MobileErr')

    function validateEmail(val) {
      const v = String(val || '').trim()
      if (!v) return true
      const at = v.indexOf('@')
      const dot = v.lastIndexOf('.')
      return !(at < 1 || dot < at + 2 || dot + 2 >= v.length)
    }

    function validatePhone(val) {
      const digits = String(val || '').replace(/\D/g, '')
      // Basic validation: 10–15 digits
      return digits.length >= 10 && digits.length <= 15
    }

    function setFieldError(inputEl, errEl, msg) {
      if (!inputEl || !errEl) return
      if (msg) {
        errEl.textContent = msg
        errEl.style.visibility = 'visible'
        inputEl.setAttribute('aria-invalid', 'true')
      } else {
        errEl.textContent = ''
        errEl.style.visibility = 'hidden'
        inputEl.setAttribute('aria-invalid', 'false')
      }
    }

    function showSplash(text) {
      if (!splash || !splashInfo) return
      splashInfo.textContent = text || 'Submitted successfully.'
      splash.style.display = ''
      setTimeout(() => { splash.style.display = 'none' }, 5000)
    }

    function hidePrivacyErr() {
      if (privacy && privacyErr && privacy.checked) {
        privacyErr.style.visibility = 'hidden'
        privacy.setAttribute('aria-invalid', 'false')
      }
    }

    privacy?.addEventListener('change', hidePrivacyErr)
    const onEmailInput = () => setFieldError(emailInput, emailErr, '')
    const onMobileInput = () => setFieldError(mobileInput, mobileErr, '')
    emailInput?.addEventListener('input', onEmailInput)
    mobileInput?.addEventListener('input', onMobileInput)

    async function onSubmit(e) {
      e.preventDefault()
      if (!form) return

      // Mandatory checks (match Zoho fields)
      const requiredMap = [
        ['Company', 'Company'],
        ['First Name', 'First Name'],
        ['Last Name', 'Last Name'],
        ['Email', 'Email'],
        ['Mobile', 'Mobile Phone'],
      ]
      for (const [name, label] of requiredMap) {
        const field = form.elements[name]
        if (field && String(field.value || '').trim().length === 0) {
          alert(`${label} cannot be empty.`)
          field.focus()
          return
        }
      }

      const emailEl = emailInput || form.querySelector('[ftype=email]')
      if (emailEl && !validateEmail(emailEl.value)) {
        setFieldError(emailEl, emailErr, 'Please enter a valid email address.')
        emailEl.focus()
        return
      } else {
        setFieldError(emailEl, emailErr, '')
      }

      const mobileEl = mobileInput || form.querySelector('#Mobile')
      if (mobileEl && !validatePhone(mobileEl.value)) {
        setFieldError(mobileEl, mobileErr, 'Please enter a valid phone number.')
        mobileEl.focus()
        return
      } else {
        setFieldError(mobileEl, mobileErr, '')
      }

      if (privacy && !privacy.checked) {
        if (privacyErr) privacyErr.style.visibility = 'visible'
        privacy.setAttribute('aria-invalid', 'true')
        privacy.focus()
        return
      }

      const submitBtn = form.querySelector('.formsubmit')
      submitBtn?.setAttribute('disabled', 'true')

      try {
        // Submit the actual HTML form to Zoho via hidden iframe to avoid CORS
        const iframe = ref.current?.querySelector('iframe[name="zohotarget"]')
        let handled = false

        function onDone() {
          if (handled) return
          handled = true
          showSplash('Thanks! Your request has been sent.')
          form.reset()
          // Clear validation error states after reset
          setFieldError(emailInput, emailErr, '')
          setFieldError(mobileInput, mobileErr, '')
          submitBtn?.removeAttribute('disabled')
          iframe?.removeEventListener('load', onDone)
        }

        iframe?.addEventListener('load', onDone)
        form.submit()
        // Safety: in case load doesn't fire due to cross-origin, fallback after 2s
        setTimeout(onDone, 2000)
      } catch (err) {
        alert('An error occurred while submitting the form.')
        submitBtn?.removeAttribute('disabled')
      }
    }

    form?.addEventListener('submit', onSubmit)

    // Inject Zoho analytics tracking
    const existingAnalytic = document.getElementById('wf_anal')
    if (!existingAnalytic) {
      const s = document.createElement('script')
      s.id = 'wf_anal'
      s.src = 'https://crm.zohopublic.com/crm/WebFormAnalyticsServeServlet?rid=b6a700593e46b9efd4940ee65bf3a3be8aea37f83e860e4b09fd59e17cf32c7b8bf35503e94d0376d1e483a3223ce8d4gid1985c38f74a2ea51e55baeb3c9ebbdafa3764f5f2bcbb17ce58aa2d6971a7242gid3de59430718a0887d3f3f37830d5227b492c3c8c8245499dd9a48fbd0a56c455gidf882379a5dbb5f65df1bd19a3533064dd71943308e9d975620540c56e472bb3c&tw=bdeeb174fe9ff1d8090033f792ffc5975a45d46737b5f9a98ed244c8df4dc2ba'
      document.body.appendChild(s)
    }

    return () => {
      form?.removeEventListener('submit', onSubmit)
      privacy?.removeEventListener('change', hidePrivacyErr)
      emailInput?.removeEventListener('input', onEmailInput)
      mobileInput?.removeEventListener('input', onMobileInput)
    }
  }, [])

  return (
    <div className="zoho-form" ref={ref}>
      <div id='crmWebToEntityForm' className='zcwf_lblLeft crmWebToEntityForm'>
        <div className='wf_customMessageBox' id='wf_splash' style={{ display: 'none' }}>
          <div className='wf_customCircle'>
            <div className='wf_customCheckMark' />
          </div>
          <span id='wf_splash_info' />
        </div>
        <form
          id='webform6985731000000589853'
          name='WebToLeads6985731000000589853'
          acceptCharset='UTF-8'
          method='POST'
          action='https://crm.zoho.com/crm/WebToLeadForm'
          target='zohotarget'
        >
          {/* Required hidden fields (Do not remove) */}
          <input type='text' style={{ display: 'none' }} name='xnQsjsdp' defaultValue='bf89fc5afc11b4095eca20b965e5a064fe862319a81f3126e911f2f9ead98ed1' />
          <input type='hidden' name='zc_gad' id='zc_gad' defaultValue='' />
          <input type='text' style={{ display: 'none' }} name='xmIwtLD' defaultValue='0b7a76fef7aac8be4fbcaae1d3a99677d503347fa58cd99c5762cb685eae1e6d40646aaabbb7e03837a2f4bd7f100e64' />
          <input type='text' style={{ display: 'none' }} name='actionType' defaultValue='TGVhZHM=' />
          {/* Redirect back to the same page after Zoho processes the lead. Since the form
              posts to a hidden iframe, this is mostly advisory. */}
          <input type='text' style={{ display: 'none' }} name='returnURL' defaultValue={window?.location?.href || ''} />

          <div className='zcwf_title'>Dealer Membership</div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Company'>Company <span style={{ color: 'red' }}>*</span></label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Company' name='Company' maxLength='200' aria-label='Company' aria-required='true' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Industry'>Industry</label>
            </div>
            <div className='zcwf_col_fld'>
              <select className='zcwf_col_fld_slt' id='Industry' name='Industry' aria-label='Industry'>
                <option value='-None-'>-None-</option>
                <option value='ASP (Application Service Provider)'>ASP (Application Service Provider)</option>
                <option value='Data/Telecom OEM'>Data/Telecom OEM</option>
                <option value='ERP (Enterprise Resource Planning)'>ERP (Enterprise Resource Planning)</option>
                <option value='Government/Military'>Government/Military</option>
                <option value='Large Enterprise'>Large Enterprise</option>
                <option value='ManagementISV'>ManagementISV</option>
                <option value='MSP (Management Service Provider)'>MSP (Management Service Provider)</option>
                <option value='Network Equipment Enterprise'>Network Equipment Enterprise</option>
                <option value='Non-management ISV'>Non-management ISV</option>
                <option value='Optical Networking'>Optical Networking</option>
                <option value='Service Provider'>Service Provider</option>
                <option value='Small/Medium Enterprise'>Small/Medium Enterprise</option>
                <option value='Storage Equipment'>Storage Equipment</option>
                <option value='Storage Service Provider'>Storage Service Provider</option>
                <option value='Systems Integrator'>Systems Integrator</option>
                <option value='Wireless Industry'>Wireless Industry</option>
                <option value='ERP'>ERP</option>
                <option value='Management ISV'>Management ISV</option>
              </select>
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Designation'>Job Title</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Designation' name='Designation' maxLength='100' aria-label='Designation' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='First_Name'>First Name <span style={{ color: 'red' }}>*</span></label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='First_Name' name='First Name' maxLength='40' aria-label='First Name' aria-required='true' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Last_Name'>Last Name <span style={{ color: 'red' }}>*</span></label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Last_Name' name='Last Name' maxLength='80' aria-label='Last Name' aria-required='true' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Email'>Email <span style={{ color: 'red' }}>*</span></label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Email' name='Email' maxLength='100' aria-label='Email' aria-required='true' autoComplete='off' ftype='email' />
              <div id='EmailErr' className='zcwf_col_help' style={{ color: 'red', visibility: 'hidden', fontSize: 12 }} />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Mobile'>Mobile Phone <span style={{ color: 'red' }}>*</span></label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Mobile' name='Mobile' maxLength='30' aria-label='Mobile' aria-required='true' />
              <div id='MobileErr' className='zcwf_col_help' style={{ color: 'red', visibility: 'hidden', fontSize: 12 }} />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Website'>Website</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Website' name='Website' maxLength='255' aria-label='Website' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Street'>Street</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Street' name='Street' maxLength='250' aria-label='Street' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='City'>City</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='City' name='City' maxLength='100' aria-label='City' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='State'>State</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='State' name='State' maxLength='100' aria-label='State' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Zip_Code'>Zip Code</label>
            </div>
            <div className='zcwf_col_fld'>
              <input type='text' id='Zip_Code' name='Zip Code' maxLength='30' aria-label='Zip Code' />
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row wfrm_fld_dpNn'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Lead_Status'>Lead Status</label>
            </div>
            <div className='zcwf_col_fld'>
              <select className='zcwf_col_fld_slt' id='Lead_Status' name='Lead Status' aria-label='Lead Status' defaultValue='Not Contacted'>
                <option value='-None-'>-None-</option>
                <option value='Attempted to Contact'>Attempted to Contact</option>
                <option value='Contact in Future'>Contact in Future</option>
                <option value='Contacted'>Contacted</option>
                <option value='Junk Lead'>Junk Lead</option>
                <option value='Lost Lead'>Lost Lead</option>
                <option value='Not Contacted'>Not Contacted</option>
                <option value='Pre-Qualified'>Pre-Qualified</option>
                <option value='Not Qualified'>Not Qualified</option>
              </select>
              <div className='zcwf_col_help' />
            </div>
          </div>

          <div className='zcwf_row wfrm_fld_dpNn'>
            <div className='zcwf_col_lab'>
              <label htmlFor='Lead_Source'>Lead Source</label>
            </div>
            <div className='zcwf_col_fld'>
              <select className='zcwf_col_fld_slt' id='Lead_Source' name='Lead Source' aria-label='Lead Source' defaultValue='Online Store'>
                <option value='-None-'>-None-</option>
                <option value='Advertisement'>Advertisement</option>
                <option value='Cold Call'>Cold Call</option>
                <option value='Employee Referral'>Employee Referral</option>
                <option value='External Referral'>External Referral</option>
                <option value='Online Store'>Online Store</option>
                <option value='X (Twitter)'>X (Twitter)</option>
                <option value='Facebook'>Facebook</option>
                <option value='Partner'>Partner</option>
                <option value='Public Relations'>Public Relations</option>
                <option value='Sales Email Alias'>Sales Email Alias</option>
                <option value='Seminar Partner'>Seminar Partner</option>
                <option value='Internal Seminar'>Internal Seminar</option>
                <option value='Trade Show'>Trade Show</option>
                <option value='Web Download'>Web Download</option>
                <option value='Web Research'>Web Research</option>
                <option value='Chat'>Chat</option>
              </select>
              <div className='zcwf_col_help' />
            </div>
          </div>

          <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' defaultValue='' />

          <div className='zcwf_row'>
            <div className='zcwf_col_lab' />
            <div className='zcwf_col_fld zcwf_actions'>
              <input type='submit' id='formsubmit' className='formsubmit zcwf_button btn btn--primary' value='Submit' title='Submit' aria-label='Submit' />
              <input type='reset' className='zcwf_button btn' name='reset' value='Reset' title='Reset' aria-label='Reset' />
            </div>
          </div>

          <div className='zcwf_row'>
            <div className='zcwf_privacy'>
              <div className='dIB vaT' aria-live='polite'>
                <label className='newCustomchkbox-md dIB w100_per'>
              <input id='privacyTool6985731000000589853' name='privacyTool' type='checkbox' aria-checked='false' aria-errormessage='privacyErr6985731000000589853' aria-label='privacyTool' />
                </label>
              </div>
              <div className='dIB zcwf_privacy_txt'>
                <div>Privacy Policy</div>
              </div>
              <div id='privacyErr6985731000000589853' style={{ fontSize: 12, color: 'red', paddingLeft: 5, visibility: 'hidden' }}>Please accept this</div>
            </div>
          </div>
        {/* Hidden iframe target used to submit cross-origin without navigating */}
        <iframe name='zohotarget' title='Zoho Submission Target' style={{ display: 'none' }} />
        </form>
      </div>
    </div>
  )
}
