
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://dsoafkhbxwxhzvgivbxh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb2Fma2hieHd4aHp2Z2l2YnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNDI4NTIsImV4cCI6MjA0ODcxODg1Mn0.-KmKuO-nzjevx7MvnVKtm-q7kNNc4-I3y5zBH19Bqzw"; // Replace with actual key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.querySelector(
    "#profileForm .button input[type='submit']"
  );
  const profilePicInput = document.getElementById("uploadImage");

  saveButton.addEventListener("click", async function (e) {
    e.preventDefault();

    let publicUrl = null;

    // If a file is selected, upload it to Supabase and get the public URL
    const file = profilePicInput.files[0];
    if (file) {
      const bucketName = "Profile Images";
      const fileName = `profile-pictures/${Date.now()}_${file.name}`; // Unique file name

      try {
        console.log("Uploading File:", file);

        // Upload file to Supabase bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, { contentType: file.type });

        if (uploadError) {
          throw new Error(`Upload Error: ${uploadError.message}`);
        }

        console.log("Upload Successful:", uploadData);

        // Retrieve public URL using Supabase's method
        const { data: publicUrlData, error: publicUrlError } =
          supabase.storage.from(bucketName).getPublicUrl(fileName);

        if (publicUrlError) {
          throw new Error(`Public URL Error: ${publicUrlError.message}`);
        }

        publicUrl = publicUrlData.publicUrl;
        console.log("Public URL:", publicUrl);

        // Update the profile picture in the DOM
        const profilePicElement = document.getElementById("profilePic");
        profilePicElement.src = `${publicUrl}?t=${new Date().getTime()}`; // Avoid caching
        profilePicElement.alt = "Uploaded Profile Picture";
      } catch (error) {
        console.error("Error during file upload:", error.message);
        showNotification(
          "Failed to upload profile picture: " + error.message,
          "error"
        );
        return; // Exit if upload fails
      }
    }

    // Gather profile data
    const user_id = sessionStorage.getItem("user_id"); // Use the session-stored user_id
    if (!user_id) {
      showNotification("User ID not found. Please log in.", "error");
      return;
    }

    const profileData = {
      user_id: user_id,
      full_name: document.getElementById("fullName").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      phone_number: document.getElementById("phone").value,
      location: document.getElementById("location").value,
      date_of_birth: document.getElementById("dob").value,
      height_cm: document.getElementById("height").value,
      weight_kg: document.getElementById("weight").value,
      target_weight: document.getElementById("targetWeight").value,
      ideal_bmi: document.getElementById("idealBMI").value,
      role: document.getElementById("roleInput").value,
      profile_picture_url: publicUrl, // Include the uploaded public URL
    };

    // Send data to backend
    try {
      const response = await fetch(
        "https://nutrifit-backend.onrender.com/save_profile.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        showNotification("Profile saved successfully!", "success");
      } else {
        showNotification("Failed to save profile: " + result.message, "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error.message);
      showNotification(
        "An error occurred while saving your profile.",
        "error"
      );
    }
  });

  // Function to show notification
  function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = message;
      notification.style.backgroundColor =
        type === "success" ? "#28a745" : "#dc3545"; // Green for success, red for error
      notification.classList.add("show");
      setTimeout(() => notification.classList.remove("show"), 3000);
    }
  }
});




























document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user_id from sessionStorage
    const userId = sessionStorage.getItem('user_id'); // Dynamically retrieve user ID
    if (!userId) {
        console.error("No user_id found in session storage. Redirecting to login...");
        window.location.href = 'login.html'; // Redirect to login page if user_id is missing
        return;
    }

    // Submit Profile Form Data to Backend
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Gather form data
        const formData = {
            user_id: userId, // Use dynamically retrieved user ID
            full_name: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            date_of_birth: document.getElementById('dob').value,
            height_cm: document.getElementById('height').value,
            weight_kg: document.getElementById('weight').value,
            target_weight: document.getElementById('targetWeight').value,
            ideal_bmi: document.getElementById('idealBMI').value,
            role: document.getElementById('roleInput')?.value || "Health Enthusiast", // Role input
            social_links: {
                facebook: document.getElementById('facebookInput')?.value || "",
                twitter: document.getElementById('twitterInput')?.value || "",
                instagram: document.getElementById('instagramInput')?.value || "",
            },
        };

        // Send data to backend
        fetch('https://nutrifit-backend.onrender.com/save_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success notification
                    showNotification(data.message, 'success');
                } else {
                    // Show error notification
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while saving your profile.', 'error');
            });
    });

    // Function to show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545'; // Green for success, red for error
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
    }

    // Toggle role edit functionality
    window.toggleRoleEdit = function () {
        const roleEditSection = document.querySelector('.role-edit');
        const roleDisplaySection = document.querySelector('.role');
        const isEditing = roleEditSection.style.display === 'block';

        if (isEditing) {
            // Cancel editing
            document.getElementById('roleInput').value = document.getElementById('userRole').textContent;
        }
        
        roleEditSection.style.display = isEditing ? 'none' : 'block';
        roleDisplaySection.style.display = isEditing ? 'block' : 'none';
    };

    // Save role and update DOM
    window.saveRole = function () {
        const roleInput = document.getElementById('roleInput').value;
        const userRole = document.getElementById('userRole');
        userRole.textContent = roleInput;
        toggleRoleEdit();
    };

    // Toggle social links edit functionality
    window.toggleSocialEdit = function () {
        const socialEditSection = document.querySelector('.social-edit');
        const socialDisplaySection = document.querySelector('.social-links');
        const isEditing = socialEditSection.style.display === 'block';

        if (isEditing) {
            // Cancel editing
            document.getElementById('facebookInput').value = document.getElementById('facebookLink').href;
            document.getElementById('twitterInput').value = document.getElementById('twitterLink').href;
            document.getElementById('instagramInput').value = document.getElementById('instagramLink').href;
        }

        socialEditSection.style.display = isEditing ? 'none' : 'block';
        socialDisplaySection.style.display = isEditing ? 'block' : 'none';
    };

    // Save social links and update DOM
    window.saveSocialLinks = function () {
        const facebookInput = document.getElementById('facebookInput').value;
        const twitterInput = document.getElementById('twitterInput').value;
        const instagramInput = document.getElementById('instagramInput').value;

        document.getElementById('facebookLink').href = facebookInput || "#";
        document.getElementById('twitterLink').href = twitterInput || "#";
        document.getElementById('instagramLink').href = instagramInput || "#";

        toggleSocialEdit();
    };
});










document.addEventListener('DOMContentLoaded', async function () {
    const userId = sessionStorage.getItem('user_id'); // Get user ID from session storage

    if (!userId) {
        console.error("No user_id found in session storage. Redirecting to login...");
        window.location.href = 'login.html'; // Redirect to login if user_id is not found
        return;
    }

    try {
        console.log("Fetching user profile for user_id:", userId);
        const response = await fetch(`https://nutrifit-backend.onrender.com/get_profile.php?user_id=${userId}`);
        const result = await response.json();

        if (result.status === 'success') {
            const profileData = result.data;
            console.log("Profile Data Retrieved:", profileData);

            // Check if elements exist before updating
            const fullNameField = document.getElementById('fullName');
            const displayNameField = document.getElementById('displayName');
            const roleInputField = document.getElementById('roleInput');
            const userRoleField = document.getElementById('userRole');
            const facebookLinkField = document.getElementById('facebookLink');
            const twitterLinkField = document.getElementById('twitterLink');
            const instagramLinkField = document.getElementById('instagramLink');
            const profilePicElement = document.getElementById('profilePic'); // Profile picture element

            if (!fullNameField || !displayNameField || !roleInputField || !userRoleField || !facebookLinkField || !twitterLinkField || !instagramLinkField || !profilePicElement) {
                console.error("One or more elements are missing in the HTML. Check your IDs.");
                return;
            }

            // Populate the profile form
            fullNameField.value = profileData.full_name || "";
            displayNameField.textContent = profileData.full_name || "John Doe"; // Dynamically display the full name
            document.getElementById('username').value = profileData.username || "";
            document.getElementById('email').value = profileData.email || "";
            document.getElementById('phone').value = profileData.phone_number || "";
            document.getElementById('location').value = profileData.location || "";
            document.getElementById('dob').value = profileData.date_of_birth || "";
            document.getElementById('height').value = profileData.height_cm || "";
            document.getElementById('weight').value = profileData.weight_kg || "";
            document.getElementById('targetWeight').value = profileData.target_weight || "";
            document.getElementById('idealBMI').value = profileData.ideal_bmi || "";

            // Populate the role
            console.log("Role:", profileData.role);
            roleInputField.value = profileData.role || "Health Enthusiast";
            userRoleField.textContent = profileData.role || "Health Enthusiast";

            // Parse and populate social links
            console.log("Social Links Raw Data:", profileData.social_links);
            const socialLinks =
                typeof profileData.social_links === 'string'
                    ? JSON.parse(profileData.social_links || "{}")
                    : profileData.social_links || {};
            console.log("Parsed Social Links:", socialLinks);

            document.getElementById('facebookInput').value = socialLinks.facebook || "#";
            document.getElementById('twitterInput').value = socialLinks.twitter || "#";
            document.getElementById('instagramInput').value = socialLinks.instagram || "#";

            facebookLinkField.href = socialLinks.facebook || "#";
            twitterLinkField.href = socialLinks.twitter || "#";
            instagramLinkField.href = socialLinks.instagram || "#";

            // Use the profile_picture_url from profileData
            if (profileData.profile_picture_url) {
                profilePicElement.src = `${profileData.profile_picture_url}?t=${new Date().getTime()}`; // Avoid caching
                profilePicElement.alt = "Profile Picture";
            } else {
                console.log("No profile picture URL provided.");
            }
        } else {
            console.error("Error fetching profile:", result.message);
        }
    } catch (error) {
        console.error("Error loading profile:", error.message);
    }
});
















