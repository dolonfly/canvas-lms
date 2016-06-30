require File.expand_path(File.dirname(__FILE__) + '/common')

describe "help dialog" do
  include_context "in-process server selenium tests"

  before do
    Account.default.enable_feature! :use_new_styles
  end

  context "no user logged in" do
    it "should work with no logged in user" do
      Setting.set('show_feedback_link', 'true')
      get("/login")
      f('#footer .help_dialog_trigger').click
      wait_for_ajaximations
      expect(f("#help-dialog-options")).to be_displayed
    end

    it "should no longer show a browser warning for IE" do
      Setting.set('show_feedback_link', 'true')
      get("/login")
      driver.execute_script("window.INST.browser = {ie: true, version: 8}")
      f('#footer .help_dialog_trigger').click
      wait_for_ajaximations
      expect_no_flash_message :error
    end
  end

  context "help as a student" do
    before (:each) do
      course_with_student_logged_in(:active_all => true)
    end

    it "should show the Help dialog when help is clicked and feedback is enabled" do
      get "/dashboard"
      expect(f("body")).not_to contain_css('#help_tray')
      expect(f("#content")).not_to contain_css('.help_dialog_trigger')

      Setting.set('show_feedback_link', 'true')
      get "/dashboard"
      expect(ff('#global_nav_help_link').length).to eq(1)
      expect(f("body")).not_to contain_css('#help_tray')
      f('#global_nav_help_link').click
      wait_for_ajaximations
      expect(f("#help_tray")).to be_displayed
      expect(f("#help_tray a[href='#teacher_feedback']")).to be_displayed
    end

    it "should show the support url link in global nav correctly" do
      # if @domain_root_account or Account.default have settings[:support_url] set there should be a link to that site
      support_url = 'http://example.com/support'
      Account.default.update_attribute(:settings, {:support_url => support_url})
      get "/dashboard"
      link = f("a[href='#{support_url}']")
      expect(link['id']).not_to eq 'global_nav_help_link'
    end

    it "should allow sending the teacher a message" do
      Setting.set('show_feedback_link', 'true')
      course_with_ta(course: @course)
      get "/courses/#{@course.id}"
      expect(f("body")).not_to contain_css("#help_tray")
      trigger = f('#global_nav_help_link')
      expect(trigger).to be_displayed
      trigger.click
      wait_for_ajaximations
      expect(f("#help_tray")).to be_displayed
      teacher_feedback_link = f("#help_tray a[href='#teacher_feedback']")
      expect(teacher_feedback_link).to be_displayed
      teacher_feedback_link.click
      feedback_form = f("form[action='/api/v1/conversations']")
      wait_for_ajaximations
      expect(feedback_form.find_element(:css, '[name="recipients[]"]')['value']).to eq "course_#{@course.id}_admins"
      feedback_form.find_element(:css, '[name="body"]').send_keys('test message')
      submit_form(feedback_form)
      wait_for_ajaximations
      expect(feedback_form).not_to be_displayed
      cm = ConversationMessage.last
      expect(cm.recipients).to match_array @course.instructors
      expect(cm.recipients.count).to eq 2
      expect(cm.body).to match(/test message/)
    end

    # TODO reimplement per CNVS-29608, but make sure we're testing at the right level
    it "should allow submitting a ticket"
  end

  context "help dialog as a teacher" do
    before(:each) do
      course_with_teacher_logged_in(:active_all => true)
    end

    it "should not show the Message teacher button if not a student" do
      Setting.set('show_feedback_link', 'true')
      get "/dashboard"
      f('#global_nav_help_link').click
      wait_for_ajaximations
      expect(f("#help_tray")).to be_displayed
      expect(f("#help_tray")).not_to contain_css("a[href='#teacher_feedback']")
    end

    it "should show the Help dialog on the speedGrader when help is clicked and feedback is enabled" do
      @course.enroll_student(User.create).accept!
      @assignment = @course.assignments.create

      get "/courses/#{@course.id}/gradebook/speed_grader?assignment_id=#{@assignment.id}"
      wait_for_ajaximations
      expect(f("#content")).not_to contain_css('.help_dialog_trigger')

      Setting.set('show_feedback_link', 'true')
      get "/courses/#{@course.id}/gradebook/speed_grader?assignment_id=#{@assignment.id}"
      wait_for_ajaximations
      trigger = f('#gradebook_header .help_dialog_trigger')
      make_full_screen
      trigger.location_once_scrolled_into_view
      expect(trigger).to be_displayed
      trigger.click
      wait_for_ajaximations
      expect(f("#help-dialog")).to be_displayed
      expect(f("#help-dialog a[href='#create_ticket']")).to be_displayed
    end
  end
end
