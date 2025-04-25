require 'csv'
require 'fileutils'
require 'aws-sdk-polly'

polly = Aws::Polly::Client.new(
  region: 'us-east-2',
  access_key_id: ENV["access_key_id"],
  secret_access_key: ENV["secret_access_key"]
)

# Paths to the input files
questions_file = './preprocess/questions/all.csv'
voices_file = './preprocess/voices.csv'
output_dir = './audios'

# Create the audios directory if it doesn't exist
FileUtils.mkdir_p(output_dir)

# Read the voices from voices.csv
voices = CSV.read(voices_file, headers: true).map { |row| [row['id'], row['voice']] }

# Read the questions from all.csv
CSV.foreach(questions_file, headers: true) do |row|
  question_id = row['question_id']
  question_text = row['question']

  # Create a folder for the question
  question_dir = File.join(output_dir, question_id)
  FileUtils.mkdir_p(question_dir)

  voices.each do |voice_id, voice_name|
    resp = polly.synthesize_speech({
      output_format: "mp3",
      text: question_text,
      voice_id: voice_name,
    })

    File.open(File.join(question_dir, "#{voice_id}.mp3"), "wb") do |file|
      file.write(resp.audio_stream.read)
    end
  end
end

puts "Audio files have been generated in the '#{output_dir}' directory."
