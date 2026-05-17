
  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('check_in').min  = today;
  document.getElementById('check_out').min = today;
  document.getElementById('check_in').addEventListener('change', function () {
    document.getElementById('check_out').min = this.value;
  });

  document.getElementById('bookingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn       = document.getElementById('submitBtn');
    const spinner   = document.getElementById('spinner');
    const btnText   = document.getElementById('btnText');
    const successEl = document.getElementById('successMsg');
    const errorEl   = document.getElementById('errorMsg');

    successEl.style.display = 'none';
    errorEl.style.display   = 'none';

    // Collect values
    const name      = document.getElementById('guest_name').value.trim();
    const email     = document.getElementById('guest_email').value.trim();
    const phone     = document.getElementById('guest_phone').value.trim();
    const roomType  = document.getElementById('room_type').value;
    const checkIn   = document.getElementById('check_in').value;
    const checkOut  = document.getElementById('check_out').value;
    const numGuests = document.getElementById('num_guests').value;

    // Validate required fields
    if (!name || !email || !phone || !roomType || !checkIn || !checkOut || !numGuests) {
      errorEl.innerHTML = '⚠️ &nbsp;<strong>Please fill in all required fields marked with *.</strong>';
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (checkOut <= checkIn) {
      errorEl.innerHTML = '⚠️ &nbsp;<strong>Check-out date must be after check-in date.</strong>';
      errorEl.style.display = 'block';
      return;
    }

    // Loading state
    btn.disabled = true;
    spinner.style.display = 'block';
    btnText.textContent   = 'Sending…';

    const params = {
      guest_name:  name,
      guest_email: email,
      guest_phone: phone,
      room_type:   roomType,
      check_in:    checkIn,
      check_out:   checkOut,
      num_guests:  numGuests,
      purpose:     document.getElementById('purpose').value,
      message:     document.getElementById('message').value.trim() || 'No special requests.',
    };

    try {
      const response = await fetch('/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        document.getElementById('confirmedName').textContent  = name;
        document.getElementById('confirmedEmail').textContent = email;
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        this.reset();
      } else {
        throw new Error(result.message || 'Server returned an error');
      }
    } catch (err) {
      console.error('Booking error:', err);
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      btn.disabled = false;
      spinner.style.display = 'none';
      btnText.textContent   = 'Send Booking Enquiry';
    }
  });
